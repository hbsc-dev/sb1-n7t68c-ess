import { RepairItem, ScooterModel, VehicleState } from '../types';

export const modelOptions: ScooterModel[] = [
  { id: '1', value: 'BirdOne', label: 'Bird One' },
  { id: '2', value: 'BirdThree', label: 'Bird Three' },
  { id: '3', value: 'BirdBike', label: 'Bird Bike' },
  { id: '4', value: 'eES600', label: 'e-Moob ES600' },
];

export const defaultVehicleStates: VehicleState[] = [
  { id: '1', value: 'revision', label: 'Revision' },
  { id: '2', value: 'offline', label: 'Offline' },
  { id: '3', value: 'powered_off', label: 'Powered Off' },
  { id: '4', value: 'hibernated', label: 'Hibernated' },
  { id: '5', value: 'water_rain_damage', label: 'Water/Rain Damage' },
  { id: '6', value: 'maintenance', label: 'Maintenance' },
  { id: '7', value: 'fleet_handling_damage', label: 'Fleet Handling Damage' },
  { id: '8', value: 'vandalized', label: 'Vandalized' },
  { id: '9', value: 'submerged', label: 'Submerged' },
  { id: '10', value: 'totaled', label: 'Totaled' },
];

export const defaultRepairOptions: RepairItem[] = [
  { id: '1', value: 'brakes', label: 'Brakes' },
  { id: '2', value: 'lights', label: 'Lights' },
  { id: '3', value: 'wheels_front', label: 'Wheels(Front)' },
  { id: '4', value: 'wheels_rear', label: 'Wheels(Rear)' },
  { id: '5', value: 'side_covers', label: 'Side-Covers' },
  { id: '6', value: 'fender_front', label: 'Fender(Front)' },
  { id: '7', value: 'fender_rear', label: 'Fender(Rear)' },
  { id: '8', value: 'steering_fork', label: 'Steering-Fork' },
  { id: '9', value: 'handlebar_neck', label: 'Handlebar-Neck' },
  { id: '10', value: 'chassis_hardware', label: 'Chassis-Hardware' },
  { id: '11', value: 'branding_stickers', label: 'Branding-Stickers' },
  { id: '12', value: 'suspension', label: 'Suspension' },
  { id: '13', value: 'battery_lock', label: 'Battery Lock' },
  { id: '14', value: 'display_unit', label: 'Display Unit' },
  { id: '15', value: 'acceleration_motor_controller_drivetrain', label: 'Acceleration-Motor-Controller-Drivetrain' },
  { id: '16', value: 'battery_low_threshold', label: 'Battery(Low Threshold)' },
  { id: '17', value: 'charging_issues', label: 'Charging Issues' },
  { id: '18', value: 'connectivity', label: 'Connectivity' },
  { id: '19', value: 'other', label: 'Other' },
];

export const loadVehicleStates = (): VehicleState[] => {
  const stored = localStorage.getItem('vehicle-states');
  return stored ? JSON.parse(stored) : defaultVehicleStates;
};

export const saveVehicleStates = (states: VehicleState[]) => {
  localStorage.setItem('vehicle-states', JSON.stringify(states));
};

export const loadRepairOptions = (): RepairItem[] => {
  const stored = localStorage.getItem('repair-options');
  return stored ? JSON.parse(stored) : defaultRepairOptions;
};

export const saveRepairOptions = (options: RepairItem[]) => {
  localStorage.setItem('repair-options', JSON.stringify(options));
};

export const vehicleStates = loadVehicleStates();
export const repairOptions = loadRepairOptions();