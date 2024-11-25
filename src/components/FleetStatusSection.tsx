import React from 'react';
import { Doughnut, Bar } from 'react-chartjs-2';
import { Share2 } from 'lucide-react';
import { useStore } from '../store/useStore';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import {
  Chart as ChartJS,
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  ArcElement,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ChartDataLabels
);

export default function FleetStatusSection() {
  const { settings, records } = useStore();
  const { fleetCount = { birdUnits: 0, eMoobUnits: 0 }, theme } = settings || {};
  
  const totalFleet = fleetCount.birdUnits + fleetCount.eMoobUnits;
  const birdPercentage = totalFleet > 0 ? ((fleetCount.birdUnits / totalFleet) * 100).toFixed(1) : '0';
  const eMoobPercentage = totalFleet > 0 ? ((fleetCount.eMoobUnits / totalFleet) * 100).toFixed(1) : '0';

  // Get pending records by model
  const pendingByModel = records
    .filter(record => record.status !== 'completed')
    .reduce((acc: Record<string, number>, record) => {
      acc[record.model] = (acc[record.model] || 0) + 1;
      return acc;
    }, {});

  // Get records by status and model
  const statusByModel = records
    .filter(record => record.status !== 'completed')
    .reduce((acc: Record<string, Record<string, number>>, record) => {
      if (!acc[record.status]) {
        acc[record.status] = {};
      }
      acc[record.status][record.model] = (acc[record.status][record.model] || 0) + 1;
      return acc;
    }, {});

  const chartColors = [
    'rgba(59, 130, 246, 0.8)',   // Blue
    'rgba(16, 185, 129, 0.8)',   // Green
    'rgba(245, 158, 11, 0.8)',   // Yellow
    'rgba(139, 92, 246, 0.8)',   // Purple
  ];

  // Fleet Distribution Chart
  const fleetData = {
    labels: [`BIRD (${birdPercentage}%)`, `e-Moob (${eMoobPercentage}%)`],
    datasets: [{
      data: [fleetCount.birdUnits, fleetCount.eMoobUnits],
      backgroundColor: chartColors.slice(0, 2),
      borderColor: ['rgba(59, 130, 246, 1)', 'rgba(16, 185, 129, 1)'],
      borderWidth: 1
    }]
  };

  // Pending by Model Chart
  const pendingModelData = {
    labels: Object.keys(pendingByModel),
    datasets: [{
      data: Object.values(pendingByModel),
      backgroundColor: chartColors,
      borderColor: chartColors.map(color => color.replace('0.8', '1')),
      borderWidth: 1
    }]
  };

  // Status Distribution Chart
  const statusLabels = ['pending', 'in-progress', 'awaiting-parts'];
  const statusData = {
    labels: statusLabels.map(status => 
      status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
    ),
    datasets: [{
      label: 'Units by Status',
      data: statusLabels.map(status => 
        Object.values(statusByModel[status] || {}).reduce((sum, count) => sum + count, 0)
      ),
      backgroundColor: chartColors.slice(0, statusLabels.length),
      borderColor: chartColors.slice(0, statusLabels.length).map(color => color.replace('0.8', '1')),
      borderWidth: 1
    }]
  };

  const handleShare = () => {
    // Calculate totals for pending + in progress
    const pendingTotal = (statusByModel['pending'] ? Object.values(statusByModel['pending']).reduce((a, b) => a + b, 0) : 0) +
                        (statusByModel['in-progress'] ? Object.values(statusByModel['in-progress']).reduce((a, b) => a + b, 0) : 0);
    const awaitingPartsTotal = statusByModel['awaiting-parts'] ? 
      Object.values(statusByModel['awaiting-parts']).reduce((a, b) => a + b, 0) : 0;

    const shareText = `*E-VIKES Fleet Status Report*%0A%0A` +
      `*Total Fleet Count:* ${totalFleet}%0A` +
      `BIRD: ${fleetCount.birdUnits}%0A` +
      `e-Moob: ${fleetCount.eMoobUnits}%0A%0A` +
      `*Pending Repair:* ${Object.values(pendingByModel).reduce((a, b) => a + b, 0)}%0A` +
      Object.entries(pendingByModel)
        .map(([model, count]) => `${model}: ${count}`)
        .join('%0A') +
      '%0A%0A*Repair Status:*%0A' +
      `Pending Repair: ${pendingTotal}%0A` +
      `Awaiting Parts: ${awaitingPartsTotal}`;

    // Open WhatsApp with the pre-filled message
    window.open(`https://wa.me/?text=${shareText}`, '_blank');
  };

  const commonOptions = {
    plugins: {
      legend: {
        position: 'bottom' as const,
        labels: {
          generateLabels: (chart: any) => {
            const data = chart.data;
            if (data.labels?.length && data.datasets.length) {
              return data.labels.map((label: string, i: number) => ({
                text: `${label}: ${data.datasets[0].data[i]} units`,
                fillStyle: data.datasets[0].backgroundColor[i],
                hidden: false,
                lineCap: 'butt',
                lineDash: [],
                lineDashOffset: 0,
                lineJoin: 'miter',
                lineWidth: 1,
                strokeStyle: data.datasets[0].backgroundColor[i],
                pointStyle: 'circle',
                datasetIndex: 0,
                index: i
              }));
            }
            return [];
          }
        }
      },
      datalabels: {
        color: '#ffffff',
        font: {
          weight: 'bold',
          size: 14
        },
        formatter: (value: number) => value > 0 ? value : '',
      }
    },
    cutout: '60%',
    responsive: true,
    maintainAspectRatio: false
  };

  return (
    <div className="modern-card p-6 mt-8 relative">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Fleet Status</h2>
        <button
          onClick={handleShare}
          className="flex items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors"
        >
          <Share2 className="w-4 h-4" />
          Share via WhatsApp
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="h-[300px]">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
            Total Fleet Distribution
          </h3>
          <Doughnut 
            data={fleetData} 
            options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                title: {
                  display: true,
                  text: `Total Fleet: ${totalFleet} units`,
                  font: {
                    size: 16,
                    weight: 'bold'
                  }
                }
              }
            }} 
          />
        </div>
        <div className="h-[300px]">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
            Pending Units by Model
          </h3>
          <Doughnut 
            data={pendingModelData} 
            options={{
              ...commonOptions,
              plugins: {
                ...commonOptions.plugins,
                title: {
                  display: true,
                  text: `Total Pending: ${Object.values(pendingByModel).reduce((a, b) => a + b, 0)} units`,
                  font: {
                    size: 16,
                    weight: 'bold'
                  }
                }
              }
            }} 
          />
        </div>
        <div className="h-[300px]">
          <h3 className="text-lg font-semibold mb-4 text-center text-gray-700 dark:text-gray-300">
            Units by Status
          </h3>
          <Bar 
            data={statusData} 
            options={{
              ...commonOptions,
              cutout: undefined,
              plugins: {
                ...commonOptions.plugins,
                legend: {
                  display: false
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1
                  }
                }
              }
            }} 
          />
          <div className="mt-4 text-sm">
            {statusLabels.map(status => {
              const models = statusByModel[status] || {};
              const total = Object.values(models).reduce((sum, count) => sum + count, 0);
              if (total === 0) return null;
              
              return (
                <div key={status} className="mb-2">
                  <div className="font-semibold">
                    {status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')} - {total} Units
                  </div>
                  {Object.entries(models).map(([model, count]) => (
                    <div key={`${status}-${model}`} className="ml-4 text-gray-600 dark:text-gray-400">
                      {model}: {count}
                    </div>
                  ))}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}