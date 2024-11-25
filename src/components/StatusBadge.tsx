import React from 'react';
import { Clock, Wrench, CheckCircle2, PackageSearch } from 'lucide-react';
import { ServiceRecord } from '../types';

interface StatusBadgeProps {
  status: ServiceRecord['status'];
}

export function getStatusIcon(status: ServiceRecord['status']) {
  switch (status) {
    case 'pending':
      return <Clock className="w-5 h-5 text-yellow-500" />;
    case 'in-progress':
      return <Wrench className="w-5 h-5 text-blue-500" />;
    case 'awaiting-parts':
      return <PackageSearch className="w-5 h-5 text-purple-500" />;
    case 'completed':
      return <CheckCircle2 className="w-5 h-5 text-green-500" />;
  }
}

export function getStatusBadgeColor(status: ServiceRecord['status']) {
  switch (status) {
    case 'pending':
      return 'bg-yellow-100 text-yellow-800';
    case 'in-progress':
      return 'bg-blue-100 text-blue-800';
    case 'awaiting-parts':
      return 'bg-purple-100 text-purple-800';
    case 'completed':
      return 'bg-green-100 text-green-800';
  }
}

export default function StatusBadge({ status }: StatusBadgeProps) {
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusBadgeColor(status)}`}>
      <span className="mr-1.5">{getStatusIcon(status)}</span>
      {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
    </span>
  );
}