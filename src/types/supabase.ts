export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      service_records: {
        Row: {
          id: string
          model: string
          serial_number: string
          date_received: string
          date_completed: string | null
          vehicle_state: Json | null
          status: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id: string
          model: string
          serial_number: string
          date_received: string
          date_completed?: string | null
          vehicle_state?: Json | null
          status?: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          model?: string
          serial_number?: string
          date_received?: string
          date_completed?: string | null
          vehicle_state?: Json | null
          status?: string
          notes?: string | null
          created_at?: string
        }
      }
      repair_items: {
        Row: {
          record_id: string
          item_label: string
          item_value: string
        }
        Insert: {
          record_id: string
          item_label: string
          item_value: string
        }
        Update: {
          record_id?: string
          item_label?: string
          item_value?: string
        }
      }
      fleet_count: {
        Row: {
          id: number
          bird_units: number
          emoob_units: number
          updated_at: string
        }
        Insert: {
          id?: number
          bird_units: number
          emoob_units: number
          updated_at?: string
        }
        Update: {
          id?: number
          bird_units?: number
          emoob_units?: number
          updated_at?: string
        }
      }
    }
  }
}