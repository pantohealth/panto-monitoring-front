import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { format } from 'date-fns';
import * as XLSX from 'xlsx';

export function exportToPDF(title: string, data: any[], columns: string[]) {
  const doc = new jsPDF();
  
  // Add title
  doc.setFontSize(16);
  doc.text(title, 14, 15);
  
  // Add timestamp
  doc.setFontSize(10);
  doc.text(`Generated on: ${format(new Date(), 'PPpp')}`, 14, 25);
  
  // Add table with proper typing
  autoTable(doc, {
    head: [columns],
    body: data.map(item => columns.map(col => item[col])),
    startY: 30,
  });
  
  // Save the PDF
  doc.save(`${title.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.pdf`);
}

export function exportToExcel(title: string, data: any[], columns: string[]) {
  // Create a new workbook
  const wb = XLSX.utils.book_new();
  
  // Convert data to worksheet format
  const ws = XLSX.utils.json_to_sheet(data, {
    header: columns
  });
  
  // Add the worksheet to the workbook
  XLSX.utils.book_append_sheet(wb, ws, 'Data');
  
  // Generate Excel file
  XLSX.writeFile(wb, `${title.toLowerCase().replace(/\s+/g, '-')}-${format(new Date(), 'yyyy-MM-dd-HH-mm')}.xlsx`);
}