import { ServiceRecord } from '../types';

const STORAGE_KEY = 'evike-service-records';

export const saveRecords = async (records: ServiceRecord[]): Promise<void> => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
  } catch (error) {
    console.error('Error saving records:', error);
  }
};

export const loadRecords = async (): Promise<ServiceRecord[]> => {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading records:', error);
    return [];
  }
};