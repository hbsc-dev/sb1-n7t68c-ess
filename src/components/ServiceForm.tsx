import React, { useState } from 'react';
import Select from 'react-select';
import { PlusCircle } from 'lucide-react';
import { RepairItem, ScooterModel, ServiceRecord, VehicleState } from '../types';
import { modelOptions, repairOptions, vehicleStates } from '../data/options';

interface ServiceFormProps {
  onSubmit: (record: ServiceRecord) => void;
}

export default function ServiceForm({ onSubmit }: ServiceFormProps) {
  const [selectedModel, setSelectedModel] = useState<ScooterModel | null>(null);
  const [serialNumber, setSerialNumber] = useState('');
  const [selectedState, setSelectedState] = useState<VehicleState | null>(null);
  const [selectedRepairs, setSelectedRepairs] = useState<RepairItem[]>([]);
  const [qrError, setQrError] = useState('');
  const [repairError, setRepairError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validateQRCode = (code: string) => {
    if (code.length < 4 || code.length > 12) {
      setQrError('QR Code must be between 4 and 12 characters');
      return false;
    }
    setQrError('');
    return true;
  };

  const validateRepairItems = () => {
    if (selectedRepairs.length === 0) {
      setRepairError('Please select at least one repair item');
      return false;
    }
    setRepairError('');
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedModel) return;
    if (!validateQRCode(serialNumber)) return;
    if (!validateRepairItems()) return;
    if (isSubmitting) return;

    try {
      setIsSubmitting(true);
      const recordId = Date.now().toString();
      const newRecord: ServiceRecord = {
        id: recordId,
        model: selectedModel.value,
        serialNumber: serialNumber.toUpperCase(),
        dateReceived: new Date().toISOString(),
        vehicleState: selectedState || undefined,
        repairItems: selectedRepairs.map(item => ({
          ...item,
          id: `${recordId}-${item.value}`
        })),
        status: 'pending',
      };
      
      await onSubmit(newRecord);
      
      // Reset form
      setSelectedModel(null);
      setSerialNumber('');
      setSelectedState(null);
      setSelectedRepairs([]);
      setQrError('');
      setRepairError('');
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleQRInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const code = e.target.value.toUpperCase();
    setSerialNumber(code);
    validateQRCode(code);
  };

  const selectStyles = {
    control: (base: any) => ({
      ...base,
      backgroundColor: 'var(--input)',
      borderColor: 'var(--border)',
      minHeight: '42px',
      height: '42px',
      '&:hover': {
        borderColor: 'var(--primary)',
      },
    }),
    menu: (base: any) => ({
      ...base,
      backgroundColor: 'var(--card)',
      borderColor: 'var(--border)',
    }),
    option: (base: any, state: any) => ({
      ...base,
      backgroundColor: state.isFocused ? 'var(--primary)' : 'var(--card)',
      color: state.isFocused ? 'white' : 'var(--text-primary)',
      '&:active': {
        backgroundColor: 'var(--primary-hover)',
      },
    }),
    singleValue: (base: any) => ({
      ...base,
      color: 'var(--text-primary)',
    }),
    multiValue: (base: any) => ({
      ...base,
      backgroundColor: 'var(--primary)',
    }),
    multiValueLabel: (base: any) => ({
      ...base,
      color: 'white',
    }),
    multiValueRemove: (base: any) => ({
      ...base,
      color: 'white',
      '&:hover': {
        backgroundColor: 'var(--primary-hover)',
        color: 'white',
      },
    }),
    valueContainer: (base: any) => ({
      ...base,
      height: '42px',
      padding: '0 8px',
    }),
    input: (base: any) => ({
      ...base,
      margin: 0,
      padding: 0,
      height: '42px',
    }),
  };

  return (
    <form onSubmit={handleSubmit} className="modern-card p-6 mb-8">
      <h2 className="text-2xl font-bold mb-6 text-gray-800 dark:text-gray-200">New Service Request</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            Model
          </label>
          <Select
            options={modelOptions}
            value={selectedModel}
            onChange={(selected) => setSelectedModel(selected as ScooterModel)}
            className="text-lg"
            styles={selectStyles}
            placeholder="Select model..."
            required
          />
        </div>
        
        <div>
          <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
            QR CODE
          </label>
          <input
            type="text"
            value={serialNumber}
            onChange={handleQRInput}
            className={`w-full h-[42px] px-3 border rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent uppercase ${
              qrError ? 'border-red-500' : 'border-gray-300 dark:border-gray-600'
            } bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100`}
            required
            placeholder="ENTER QR CODE"
            minLength={4}
            maxLength={12}
          />
          {qrError && (
            <p className="mt-1 text-red-500 text-sm">{qrError}</p>
          )}
        </div>
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Items to Repair
        </label>
        <Select
          isMulti
          options={repairOptions}
          value={selectedRepairs}
          onChange={(selected) => {
            setSelectedRepairs(selected as RepairItem[]);
            if (selected.length > 0) {
              setRepairError('');
            }
          }}
          className="text-lg"
          styles={selectStyles}
          placeholder="Select repair items..."
        />
        {repairError && (
          <p className="mt-1 text-red-500 text-sm">{repairError}</p>
        )}
      </div>

      <div className="mb-6">
        <label className="block text-lg font-medium text-gray-700 dark:text-gray-300 mb-2">
          Vehicle State (Optional)
        </label>
        <Select
          options={vehicleStates}
          value={selectedState}
          onChange={(selected) => setSelectedState(selected as VehicleState)}
          className="text-lg"
          styles={selectStyles}
          placeholder="Select vehicle state..."
          isClearable
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full flex items-center justify-center px-4 py-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors text-lg dark:bg-blue-500 dark:hover:bg-blue-600 dark:focus:ring-offset-gray-900 ${
          isSubmitting ? 'opacity-50 cursor-not-allowed' : ''
        }`}
      >
        <PlusCircle className="w-6 h-6 mr-2" />
        {isSubmitting ? 'Adding...' : 'Add Service Record'}
      </button>
    </form>
  );
}