'use client';

import { Button } from '@/components/ui/button';

export default function ExportButton({ data }: { data: any[] }) {
  const handleExport = () => {
    if (data.length === 0) return alert('No data to export');
    
    const headers = Object.keys(data[0]).join(',');
    const rows = data.map(obj => 
      Object.values(obj).map(val => `"${String(val || '').replace(/"/g, '""')}"`).join(',')
    ).join('\n');
    
    const csv = `${headers}\n${rows}`;
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = 'meetmemo_contacts.csv';
    link.click();
  };

  return (
    <Button variant="outline" size="sm" onClick={handleExport}>
      Export CSV
    </Button>
  );
}
