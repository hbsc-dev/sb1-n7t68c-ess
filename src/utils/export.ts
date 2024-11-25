import { utils, writeFile } from 'xlsx';
import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ServiceRecord } from '../types';

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString();
};

const getRepairItemsString = (record: ServiceRecord) => {
  return record.repairItems.map(item => item.label).join(', ');
};

const filterRecordsByDateRange = (records: ServiceRecord[], startDate: Date, endDate: Date) => {
  return records.filter(record => {
    const recordDate = new Date(record.dateReceived);
    return recordDate >= startDate && recordDate <= endDate;
  });
};

export const exportToExcel = (records: ServiceRecord[]) => {
  const data = records.map(record => ({
    'Date Received': formatDate(record.dateReceived),
    'Model': record.model,
    'QR Code': record.serialNumber,
    'Vehicle State': record.vehicleState?.label || '-',
    'Repair Items': getRepairItemsString(record),
    'Status': record.status,
    'Date Completed': record.dateCompleted ? formatDate(record.dateCompleted) : '-'
  }));

  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Service Records');
  
  writeFile(wb, 'e-vikes-service-records.xlsx');
};

export const exportToPDF = (records: ServiceRecord[]) => {
  const doc = new jsPDF();
  
  doc.setFontSize(20);
  doc.text('E-VIKES Service Records', 14, 15);
  
  const tableData = records.map(record => [
    formatDate(record.dateReceived),
    record.model,
    record.serialNumber,
    record.vehicleState?.label || '-',
    getRepairItemsString(record),
    record.status,
    record.dateCompleted ? formatDate(record.dateCompleted) : '-'
  ]);

  autoTable(doc, {
    head: [['Date Received', 'Model', 'QR Code', 'Vehicle State', 'Repair Items', 'Status', 'Date Completed']],
    body: tableData,
    startY: 25,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  doc.save('e-vikes-service-records.pdf');
};

export const exportPeriodicOverview = (records: ServiceRecord[], startDate: Date, endDate: Date) => {
  const filteredRecords = filterRecordsByDateRange(records, startDate, endDate);
  
  // Create both Excel and PDF versions
  const doc = new jsPDF();
  doc.setFontSize(20);
  doc.text('E-VIKES Periodic Overview', 14, 15);
  doc.setFontSize(12);
  doc.text(`Period: ${formatDate(startDate.toISOString())} - ${formatDate(endDate.toISOString())}`, 14, 25);

  const tableData = filteredRecords.map(record => [
    formatDate(record.dateReceived),
    record.model,
    record.serialNumber,
    record.vehicleState?.label || '-',
    getRepairItemsString(record),
    record.status,
    record.dateCompleted ? formatDate(record.dateCompleted) : '-'
  ]);

  autoTable(doc, {
    head: [['Date Received', 'Model', 'QR Code', 'Vehicle State', 'Repair Items', 'Status', 'Date Completed']],
    body: tableData,
    startY: 35,
    styles: { fontSize: 8 },
    headStyles: { fillColor: [59, 130, 246] },
  });

  // Add summary statistics
  const totalRecords = filteredRecords.length;
  const completedRecords = filteredRecords.filter(r => r.status === 'completed').length;
  const pendingRecords = totalRecords - completedRecords;

  const summaryY = doc.lastAutoTable.finalY + 20;
  doc.setFontSize(14);
  doc.text('Summary Statistics', 14, summaryY);
  doc.setFontSize(12);
  doc.text(`Total Records: ${totalRecords}`, 14, summaryY + 10);
  doc.text(`Completed: ${completedRecords}`, 14, summaryY + 20);
  doc.text(`Pending: ${pendingRecords}`, 14, summaryY + 30);

  doc.save(`e-vikes-periodic-overview-${formatDate(startDate.toISOString())}-${formatDate(endDate.toISOString())}.pdf`);

  // Export Excel version
  const data = filteredRecords.map(record => ({
    'Date Received': formatDate(record.dateReceived),
    'Model': record.model,
    'QR Code': record.serialNumber,
    'Vehicle State': record.vehicleState?.label || '-',
    'Repair Items': getRepairItemsString(record),
    'Status': record.status,
    'Date Completed': record.dateCompleted ? formatDate(record.dateCompleted) : '-'
  }));

  const ws = utils.json_to_sheet(data);
  const wb = utils.book_new();
  utils.book_append_sheet(wb, ws, 'Periodic Overview');
  
  writeFile(wb, `e-vikes-periodic-overview-${formatDate(startDate.toISOString())}-${formatDate(endDate.toISOString())}.xlsx`);
};