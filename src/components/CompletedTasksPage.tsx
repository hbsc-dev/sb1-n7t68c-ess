import React, { useState } from 'react';
import { Calendar, FileDown, Search } from 'lucide-react';
import { ServiceRecord } from '../types';
import StatusBadge from './StatusBadge';
import { exportToExcel, exportToPDF } from '../utils/export';
import { useStore } from '../store/useStore';

export default function CompletedTasksPage() {
  const { records } = useStore();
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [exportFormat, setExportFormat] = useState('excel');
  const [searchTerm, setSearchTerm] = useState('');

  const completedRecords = records.filter(record => {
    if (record.status !== 'completed') return false;
    
    const matchesSearch = searchTerm === '' || 
      record.serialNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      record.model.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (!matchesSearch) return false;
    
    if (startDate && endDate) {
      const recordDate = new Date(record.dateCompleted!);
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59);
      return recordDate >= start && recordDate <= end;
    }
    
    return true;
  });

  const handleExport = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    if (exportFormat === 'excel') {
      exportToExcel(completedRecords);
    } else {
      exportToPDF(completedRecords);
    }
  };

  return (
    <div className="space-y-6 pb-20">
      <div className="modern-card p-6">
        <div className="flex flex-col space-y-6">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
              Completed Tasks
            </h2>
            
            <div className="flex flex-col md:flex-row items-stretch md:items-center gap-4">
              {/* Search Input */}
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search by QR or model..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="form-input pl-10 pr-4 py-2 w-full md:w-64"
                />
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              </div>
              
              {/* Date Range and Export Controls */}
              <div className="flex items-center gap-2">
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input py-2 w-32"
                />
                <span className="text-gray-500 dark:text-gray-400">to</span>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input py-2 w-32"
                />
                <select
                  value={exportFormat}
                  onChange={(e) => setExportFormat(e.target.value)}
                  className="form-input py-2 bg-gray-100 dark:bg-gray-700"
                >
                  <option value="excel">Excel</option>
                  <option value="pdf">PDF</option>
                </select>
                <button
                  onClick={handleExport}
                  className="btn-primary p-2"
                  title="Export"
                >
                  <FileDown className="w-5 h-5" />
                </button>
              </div>
            </div>
          </div>

          {/* Table */}
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Completion Date
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Model
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    QR Code
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Vehicle State
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Repair Items
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                    Time to Complete
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
                {completedRecords.map((record) => {
                  const timeToComplete = record.dateCompleted && record.dateReceived
                    ? Math.ceil((new Date(record.dateCompleted).getTime() - new Date(record.dateReceived).getTime()) / (1000 * 60 * 60 * 24))
                    : 0;

                  return (
                    <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {record.dateCompleted ? new Date(record.dateCompleted).toLocaleDateString() : '-'}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {record.model}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-mono text-gray-900 dark:text-gray-300">
                        {record.serialNumber}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {record.vehicleState?.label || '-'}
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900 dark:text-gray-300">
                        <div className="flex flex-wrap gap-1">
                          {record.repairItems.map((item) => (
                            <span
                              key={item.id}
                              className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300"
                            >
                              {item.label}
                            </span>
                          ))}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <StatusBadge status={record.status} />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                        {timeToComplete} days
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
            
            {completedRecords.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No completed tasks found for the selected period.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}