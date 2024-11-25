import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { ServiceRecord, AppSettings } from '../types';
import { supabase } from '../lib/supabase';

interface StoreState {
  records: ServiceRecord[];
  settings: AppSettings;
  initialized: boolean;
  error: string | null;
  addRecord: (record: ServiceRecord) => Promise<void>;
  updateRecordStatus: (id: string, status: ServiceRecord['status']) => Promise<void>;
  updateSettings: (settings: Partial<AppSettings>) => Promise<void>;
  initialize: () => Promise<void>;
  setError: (error: string | null) => void;
}

const initialSettings: AppSettings = {
  fontSize: 'medium',
  theme: 'light',
  fleetCount: {
    birdUnits: 0,
    eMoobUnits: 0
  }
};

export const useStore = create<StoreState>()(
  persist(
    (set, get) => ({
      records: [],
      settings: initialSettings,
      initialized: false,
      error: null,
      setError: (error) => set({ error }),

      initialize: async () => {
        if (get().initialized) return;

        try {
          const session = await supabase.auth.getSession();
          if (!session.data.session) {
            set({ error: 'Not authenticated' });
            return;
          }

          // Fetch service records with their repair items
          const { data: records, error: recordsError } = await supabase
            .from('service_records')
            .select(`
              *,
              repair_items (
                item_label,
                item_value
              )
            `)
            .order('created_at', { ascending: false });

          if (recordsError) throw recordsError;

          // Transform the records to match our ServiceRecord type
          const transformedRecords = records?.map(record => ({
            id: record.id,
            model: record.model,
            serialNumber: record.serial_number,
            dateReceived: record.date_received,
            dateCompleted: record.date_completed,
            vehicleState: record.vehicle_state,
            status: record.status,
            notes: record.notes,
            repairItems: (record.repair_items || []).map((item: any) => ({
              id: `${record.id}-${item.item_value}`,
              label: item.item_label,
              value: item.item_value
            }))
          })) || [];

          // Fetch fleet count
          const { data: fleetCount, error: fleetError } = await supabase
            .from('fleet_count')
            .select('*')
            .single();

          if (fleetError && fleetError.code !== 'PGRST116') throw fleetError;

          set({
            records: transformedRecords,
            settings: {
              ...get().settings,
              fleetCount: fleetCount ? {
                birdUnits: fleetCount.bird_units,
                eMoobUnits: fleetCount.emoob_units
              } : initialSettings.fleetCount
            },
            initialized: true,
            error: null
          });
        } catch (error) {
          console.error('Failed to initialize:', error);
          set({ error: 'Failed to load data. Please try again.' });
          setTimeout(() => get().initialize(), 3000);
        }
      },

      addRecord: async (record: ServiceRecord) => {
        try {
          const session = await supabase.auth.getSession();
          if (!session.data.session) throw new Error('Not authenticated');

          const { error: recordError } = await supabase
            .from('service_records')
            .insert({
              id: record.id,
              model: record.model,
              serial_number: record.serialNumber,
              date_received: record.dateReceived,
              date_completed: record.dateCompleted,
              vehicle_state: record.vehicleState,
              status: record.status,
              notes: record.notes,
              user_id: session.data.session.user.id
            });

          if (recordError) throw recordError;

          // Insert repair items
          const repairItemsData = record.repairItems.map(item => ({
            record_id: record.id,
            item_label: item.label,
            item_value: item.value,
            user_id: session.data.session.user.id
          }));

          const { error: itemsError } = await supabase
            .from('repair_items')
            .insert(repairItemsData);

          if (itemsError) throw itemsError;

          await get().initialize();
          set({ error: null });
        } catch (error) {
          console.error('Failed to add record:', error);
          set({ error: 'Failed to add record. Please try again.' });
          throw error;
        }
      },

      updateRecordStatus: async (id: string, status: ServiceRecord['status']) => {
        try {
          const session = await supabase.auth.getSession();
          if (!session.data.session) throw new Error('Not authenticated');

          const dateCompleted = status === 'completed' ? new Date().toISOString() : null;
          const { error } = await supabase
            .from('service_records')
            .update({ 
              status,
              date_completed: dateCompleted
            })
            .eq('id', id)
            .eq('user_id', session.data.session.user.id);

          if (error) throw error;
          await get().initialize();
          set({ error: null });
        } catch (error) {
          console.error('Failed to update record status:', error);
          set({ error: 'Failed to update status. Please try again.' });
          throw error;
        }
      },

      updateSettings: async (newSettings: Partial<AppSettings>) => {
        try {
          const session = await supabase.auth.getSession();
          if (!session.data.session) throw new Error('Not authenticated');

          const currentSettings = get().settings;
          const updatedSettings = {
            ...currentSettings,
            ...newSettings,
            fleetCount: {
              ...currentSettings.fleetCount,
              ...(newSettings.fleetCount || {})
            }
          };

          if (newSettings.fleetCount) {
            const { error } = await supabase
              .from('fleet_count')
              .upsert({
                id: 1,
                bird_units: newSettings.fleetCount.birdUnits,
                emoob_units: newSettings.fleetCount.eMoobUnits,
                user_id: session.data.session.user.id
              });

            if (error) throw error;
          }

          set({ 
            settings: updatedSettings,
            error: null
          });
          
          if (updatedSettings.theme === 'dark') {
            document.documentElement.classList.add('dark');
          } else {
            document.documentElement.classList.remove('dark');
          }
          
          document.body.className = `text-size-${updatedSettings.fontSize}`;
        } catch (error) {
          console.error('Failed to update settings:', error);
          set({ error: 'Failed to update settings. Please try again.' });
          throw error;
        }
      },
    }),
    {
      name: 'evike-service-store',
      partialize: (state) => ({
        settings: {
          fontSize: state.settings.fontSize,
          theme: state.settings.theme
        }
      })
    }
  )
);