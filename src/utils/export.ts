import { jsPDF } from 'jspdf';
import 'jspdf-autotable';
import { format } from 'date-fns';

export function exportToPDF(title: string, data: any[], columns: string[]) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 25);
  
  // Add table
  doc.autoTable({
    head: [columns],
    body: data.map(item => columns.map(col => item[col])),
    startY: 30,
  });
  
  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.pdf`);
}