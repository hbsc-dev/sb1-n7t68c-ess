import React from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { ServiceRecord } from '../types';
import StatusBadge, { getStatusBadgeColor } from './StatusBadge';

interface ServiceTableProps {
  records: ServiceRecord[];
  onStatusChange: (id: string, status: ServiceRecord['status']) => void;
  showCompleted: boolean;
  onToggleShowCompleted: () => void;
}

export default function ServiceTable({ 
  records, 
  onStatusChange, 
  showCompleted,
  onToggleShowCompleted 
}: ServiceTableProps) {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const filteredRecords = records.filter(record => {
    if (record.status === 'completed') {
      if (!showCompleted) return false;
      
      // For completed records, check if completed today
      const completionDate = new Date(record.dateCompleted!);
      completionDate.setHours(0, 0, 0, 0);
      return completionDate.getTime() === today.getTime();
    }
    return true;
  });

  return (
    <div className="space-y-4">
      <div className="flex justify-end">
        <button
          onClick={onToggleShowCompleted}
          className="flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 dark:bg-gray-800 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-700"
        >
          {showCompleted ? (
            <>
              <EyeOff className="w-4 h-4 mr-2" />
              Hide Today's Completed
            </>
          ) : (
            <>
              <Eye className="w-4 h-4 mr-2" />
              Show Today's Completed
            </>
          )}
        </button>
      </div>

      <div className="modern-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-800">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                  Date Received
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
                  Completion Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-900 dark:divide-gray-700">
              {filteredRecords.map((record) => (
                <tr key={record.id} className="hover:bg-gray-50 dark:hover:bg-gray-800">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {new Date(record.dateReceived).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {record.model}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
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
                    {record.status === 'completed' ? (
                      <StatusBadge status={record.status} />
                    ) : (
                      <select
                        value={record.status}
                        onChange={(e) => onStatusChange(record.id, e.target.value as ServiceRecord['status'])}
                        className={`rounded-full px-3 py-1 text-sm font-medium ${getStatusBadgeColor(record.status)}`}
                      >
                        <option value="pending">Pending</option>
                        <option value="in-progress">In Progress</option>
                        <option value="awaiting-parts">Awaiting Parts</option>
                        <option value="completed">Completed</option>
                      </select>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-300">
                    {record.dateCompleted ? new Date(record.dateCompleted).toLocaleTimeString() : '-'}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {filteredRecords.length === 0 && (
            <div className="text-center py-8 text-gray-500 dark:text-gray-400">
              No records to display.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}