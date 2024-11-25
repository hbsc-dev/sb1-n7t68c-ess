import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import FleetStatusSection from './FleetStatusSection';
import { useStore } from '../store/useStore';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

export default function StatsPage() {
  const { records } = useStore();
  
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  const currentMonth = new Date().getMonth();
  const last6Months = Array.from({ length: 6 }, (_, i) => {
    const month = (currentMonth - i + 12) % 12;
    return monthNames[month];
  }).reverse();

  const getMonthlyData = () => {
    const monthlyData = new Array(6).fill(0);
    records.forEach(record => {
      const date = new Date(record.dateReceived);
      const monthIndex = (date.getMonth() - currentMonth + 12) % 12;
      if (monthIndex < 6) {
        monthlyData[monthIndex]++;
      }
    });
    return monthlyData;
  };

  const getRepairItemsData = () => {
    const itemCounts: Record<string, number> = {};
    records.forEach(record => {
      record.repairItems.forEach(item => {
        itemCounts[item.label] = (itemCounts[item.label] || 0) + 1;
      });
    });
    return {
      labels: Object.keys(itemCounts),
      data: Object.values(itemCounts),
    };
  };

  const getPendingUnitsData = () => {
    const pendingRecords = records.filter(record => record.status !== 'completed');
    const statusCounts: Record<string, number> = {};
    const modelCounts: Record<string, number> = {};
    const stateCounts: Record<string, number> = {};

    pendingRecords.forEach(record => {
      statusCounts[record.status] = (statusCounts[record.status] || 0) + 1;
      modelCounts[record.model] = (modelCounts[record.model] || 0) + 1;
      if (record.vehicleState?.label) {
        stateCounts[record.vehicleState.label] = (stateCounts[record.vehicleState.label] || 0) + 1;
      }
    });

    return {
      total: pendingRecords.length,
      byStatus: {
        labels: Object.keys(statusCounts).map(status => 
          status.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')
        ),
        data: Object.values(statusCounts),
      },
      byModel: {
        labels: Object.keys(modelCounts),
        data: Object.values(modelCounts),
      },
      byState: {
        labels: Object.keys(stateCounts),
        data: Object.values(stateCounts),
      },
    };
  };

  const monthlyData = {
    labels: last6Months,
    datasets: [
      {
        label: 'Monthly Repairs',
        data: getMonthlyData(),
        borderColor: 'rgb(59, 130, 246)',
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const repairItemsData = {
    labels: getRepairItemsData().labels,
    datasets: [
      {
        label: 'Repair Items',
        data: getRepairItemsData().data,
        backgroundColor: 'rgba(59, 130, 246, 0.5)',
      },
    ],
  };

  const pendingData = getPendingUnitsData();
  const chartColors = [
    'rgba(59, 130, 246, 0.8)',  // Blue
    'rgba(245, 158, 11, 0.8)',  // Yellow
    'rgba(139, 92, 246, 0.8)',  // Purple
    'rgba(16, 185, 129, 0.8)',  // Green
  ];

  return (
    <div className="space-y-8 pb-20">
      <FleetStatusSection />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="modern-card p-6 flex flex-col items-center justify-center">
          <h3 className="text-xl font-bold mb-2 text-gray-800 dark:text-gray-200">Total Pending Units</h3>
          <p className="text-4xl font-bold text-blue-600">{pendingData.total}</p>
        </div>
        <div className="modern-card p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">By Status</h3>
          <div className="flex flex-col items-center">
            <Doughnut
              data={{
                labels: pendingData.byStatus.labels,
                datasets: [{
                  data: pendingData.byStatus.data,
                  backgroundColor: chartColors,
                }],
              }}
              options={{
                plugins: {
                  legend: {
                    position: 'bottom',
                    labels: {
                      generateLabels: (chart) => {
                        const data = chart.data;
                        if (data.labels?.length && data.datasets.length) {
                          return data.labels.map((label, i) => ({
                            text: `${label}: ${data.datasets[0].data[i]}`,
                            fillStyle: chartColors[i],
                            hidden: false,
                            lineCap: 'butt',
                            lineDash: [],
                            lineDashOffset: 0,
                            lineJoin: 'miter',
                            lineWidth: 1,
                            strokeStyle: chartColors[i],
                            pointStyle: 'circle',
                            datasetIndex: 0,
                            index: i
                          }));
                        }
                        return [];
                      }
                    }
                  },
                  tooltip: {
                    callbacks: {
                      label: (context) => {
                        const label = context.label || '';
                        const value = context.raw as number;
                        return `${label}: ${value}`;
                      }
                    }
                  }
                },
              }}
            />
          </div>
        </div>
        <div className="modern-card p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">By Model</h3>
          <Doughnut
            data={{
              labels: pendingData.byModel.labels,
              datasets: [{
                data: pendingData.byModel.data,
                backgroundColor: chartColors,
              }],
            }}
            options={{
              plugins: {
                legend: {
                  position: 'bottom',
                  labels: {
                    generateLabels: (chart) => {
                      const data = chart.data;
                      if (data.labels?.length && data.datasets.length) {
                        return data.labels.map((label, i) => ({
                          text: `${label}: ${data.datasets[0].data[i]}`,
                          fillStyle: chartColors[i],
                          hidden: false,
                          lineCap: 'butt',
                          lineDash: [],
                          lineDashOffset: 0,
                          lineJoin: 'miter',
                          lineWidth: 1,
                          strokeStyle: chartColors[i],
                          pointStyle: 'circle',
                          datasetIndex: 0,
                          index: i
                        }));
                      }
                      return [];
                    }
                  }
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      const label = context.label || '';
                      const value = context.raw as number;
                      return `${label}: ${value}`;
                    }
                  }
                }
              },
            }}
          />
        </div>
      </div>

      {pendingData.byState.labels.length > 0 && (
        <div className="modern-card p-6">
          <h3 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">By Vehicle State</h3>
          <Bar
            data={{
              labels: pendingData.byState.labels,
              datasets: [{
                label: 'Units',
                data: pendingData.byState.data,
                backgroundColor: 'rgba(59, 130, 246, 0.5)',
              }],
            }}
            options={{
              responsive: true,
              plugins: {
                legend: {
                  display: false,
                },
                tooltip: {
                  callbacks: {
                    label: (context) => {
                      return `Units: ${context.raw}`;
                    }
                  }
                }
              },
              scales: {
                y: {
                  beginAtZero: true,
                  ticks: {
                    stepSize: 1,
                  },
                },
              },
            }}
          />
        </div>
      )}

      <div className="modern-card p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Monthly Service Requests</h2>
        <Line
          data={monthlyData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                position: 'top' as const,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `Repairs: ${context.raw}`;
                  }
                }
              }
            },
          }}
        />
      </div>

      <div className="modern-card p-6">
        <h2 className="text-xl font-bold mb-4 text-gray-800 dark:text-gray-200">Most Common Repairs</h2>
        <Bar
          data={repairItemsData}
          options={{
            responsive: true,
            plugins: {
              legend: {
                display: false,
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `Units: ${context.raw}`;
                  }
                }
              }
            },
            scales: {
              y: {
                beginAtZero: true,
                ticks: {
                  stepSize: 1,
                },
              },
            },
          }}
        />
      </div>
    </div>
  );
}