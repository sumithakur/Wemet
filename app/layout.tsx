import './globals.css';
import { Ubuntu } from 'next/font/google';
import Link from 'next/link';

const ubuntu = Ubuntu({ 
  weight: ['300', '400', '500', '700'],
  subsets: ['latin'],
  variable: '--font-ubuntu'
});

export const metadata = {
  title: 'WeMet',
  description: 'Your minimal memory for the people you meet.',
  manifest: '/manifest.json',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className={`${ubuntu.variable} font-sans bg-[#FCFCFC] text-gray-900 min-h-screen pb-20 md:pb-0 md:pl-[240px] flex flex-col selection:bg-gray-900 selection:text-white`}>
        
        {/* Mobile Bottom Nav - Minimalist */}
        <nav className="md:hidden fixed bottom-0 w-full bg-white/80 backdrop-blur-md border-t border-gray-100 flex justify-around items-center h-16 z-50 pb-safe">
          <Link href="/dashboard" className="flex flex-col items-center text-gray-400 hover:text-gray-900 transition-colors w-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
          </Link>
          <Link href="/contacts" className="flex flex-col items-center text-gray-400 hover:text-gray-900 transition-colors w-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
          </Link>
          <Link href="/add" className="flex flex-col items-center text-white -mt-6">
            <div className="bg-gray-900 rounded-full w-12 h-12 flex items-center justify-center shadow-md border-[4px] border-[#FCFCFC] hover:bg-gray-800 transition-transform hover:scale-105">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            </div>
          </Link>
          <Link href="/events" className="flex flex-col items-center text-gray-400 hover:text-gray-900 transition-colors w-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
          </Link>
          <Link href="/profile" className="flex flex-col items-center text-gray-400 hover:text-gray-900 transition-colors w-full">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
          </Link>
        </nav>

        {/* Desktop Sidebar - Minimalist */}
        <aside className="hidden md:flex flex-col fixed left-0 top-0 h-screen w-[240px] bg-white border-r border-gray-100 p-8 z-50">
          <Link href="/" className="mb-12">
            <h1 className="text-xl font-bold tracking-tight text-gray-900">WeMet.</h1>
          </Link>
          
          <div className="flex flex-col gap-6 flex-1 text-sm font-medium">
            <Link href="/dashboard" className="text-gray-500 hover:text-gray-900 flex items-center gap-3 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>
              Home
            </Link>
            <Link href="/contacts" className="text-gray-500 hover:text-gray-900 flex items-center gap-3 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M22 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
              Contacts
            </Link>
            <Link href="/events" className="text-gray-500 hover:text-gray-900 flex items-center gap-3 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
              Events
            </Link>
            <Link href="/profile" className="text-gray-500 hover:text-gray-900 flex items-center gap-3 transition-colors">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              Profile
            </Link>
          </div>
          
          <Link href="/add" className="mt-auto bg-gray-900 text-white text-center py-3 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors shadow-sm flex items-center justify-center gap-2">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            Add Contact
          </Link>
        </aside>

        <main className="flex-1 w-full max-w-4xl mx-auto md:mx-0 md:max-w-none md:p-10 p-6">
          {children}
        </main>
      </body>
    </html>
  );
}
