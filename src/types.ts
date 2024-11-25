export interface RepairItem {
  id: string;
  label: string;
  value: string;
}

export interface ScooterModel {
  id: string;
  label: string;
  value: string;
}

export interface VehicleState {
  id: string;
  label: string;
  value: string;
}

export interface ServiceRecord {
  id: string;
  model: string;
  serialNumber: string;
  dateReceived: string;
  dateCompleted?: string;
  vehicleState?: VehicleState;
  repairItems: RepairItem[];
  status: 'pending' | 'in-progress' | 'awaiting-parts' | 'completed';
  notes?: string;
}

export interface AppSettings {
  fontSize: 'small' | 'medium' | 'large';
  theme: 'light' | 'dark';
  fleetCount: {
    birdUnits: number;
    eMoobUnits: number;
  };
}