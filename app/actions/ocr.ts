'use server'

import { GoogleGenAI } from '@google/genai';

export async function parseCardWithAI(base64Image: string, mimeType: string) {
  // We check for the API key. If not present, we return an error to fall back to Tesseract.
  if (!process.env.GEMINI_API_KEY) {
    throw new Error('GEMINI_API_KEY_MISSING');
  }

  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
  
  // Clean base64 string
  const base64Data = base64Image.replace(/^data:image\/\w+;base64,/, "");

  const prompt = `
  You are an expert OCR parser. Analyze this business card and extract the following details into a strict JSON object. 
  Do not include markdown blocks or any other text, just the raw JSON object.
  If a field is missing, omit it from the JSON.
  
  Schema:
  {
    "firstName": "string",
    "lastName": "string",
    "company": "string",
    "jobTitle": "string",
    "email": "string",
    "phone": "string",
    "website": "string"
  }
  
  Instructions:
  - Clean up phone numbers to standard formats.
  - Guess first and last name accurately based on the context.
  - Ensure the website has proper formatting (e.g., exclude www if possible, keep .com/etc).
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: [
        {
          role: 'user',
          parts: [
            { text: prompt },
            { inlineData: { data: base64Data, mimeType } }
          ]
        }
      ]
    });
    
    let jsonText = response.text || "{}";
    jsonText = jsonText.replace(/```json/g, '').replace(/```/g, '').trim();
    return JSON.parse(jsonText);
  } catch (error) {
    console.error("Gemini OCR Error:", error);
    throw new Error('AI_PARSE_FAILED');
  }
}
