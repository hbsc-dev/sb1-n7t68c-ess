import React, { useState } from 'react';
import { FileSpreadsheet, FileText, Calendar } from 'lucide-react';
import { ServiceRecord } from '../types';
import { exportToExcel, exportToPDF, exportPeriodicOverview } from '../utils/export';
import FleetCountSection from './FleetCountSection';
import Preferences from './Preferences';

interface SettingsPageProps {
  records: ServiceRecord[];
}

export default function SettingsPage({ records }: SettingsPageProps) {
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const handlePeriodicExport = () => {
    if (!startDate || !endDate) {
      alert('Please select both start and end dates');
      return;
    }
    exportPeriodicOverview(records, new Date(startDate), new Date(endDate));
  };

  return (
    <div className="space-y-8 pb-20">
      {/* Preferences Section */}
      <Preferences />

      {/* Export Options */}
      <div className="modern-card p-6">
        <h2 className="settings-title mb-6">Export Options</h2>
        
        <div className="space-y-6">
          {/* Quick Export Buttons */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={() => exportToExcel(records)}
              className="btn-secondary flex items-center justify-center space-x-2 hover:bg-emerald-100 dark:hover:bg-emerald-900/30"
            >
              <FileSpreadsheet className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
              <span>Export to Excel</span>
            </button>
            <button
              onClick={() => exportToPDF(records)}
              className="btn-secondary flex items-center justify-center space-x-2 hover:bg-blue-100 dark:hover:bg-blue-900/30"
            >
              <FileText className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              <span>Export to PDF</span>
            </button>
          </div>

          {/* Periodic Overview Section */}
          <div className="border-t border-gray-200 dark:border-gray-700 pt-6">
            <h3 className="settings-subtitle mb-4">Periodic Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="form-input"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-600 dark:text-gray-400 mb-2">
                  End Date
                </label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="form-input"
                />
              </div>
            </div>
            <button
              onClick={handlePeriodicExport}
              className="btn-primary w-full flex items-center justify-center space-x-2"
            >
              <Calendar className="w-5 h-5" />
              <span>Generate Overview</span>
            </button>
          </div>
        </div>
      </div>

      {/* Fleet Count Section */}
      <FleetCountSection />

      {/* Footer */}
      <footer className="modern-card p-6 text-center">
        <div className="space-y-2">
          <p className="text-gray-600 dark:text-gray-400">© 2024 Michel Harewood. All Rights Reserved</p>
          <a 
            href="mailto:hbsc.development@gmail.com" 
            className="text-primary hover:text-primary-hover transition-colors"
          >
            hbsc.development@gmail.com
          </a>
        </div>
      </footer>
    </div>
  );
}