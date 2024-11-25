-- Create extension for UUID generation if not exists
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create service_records table
CREATE TABLE IF NOT EXISTS service_records (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  model TEXT NOT NULL,
  serial_number TEXT NOT NULL,
  date_received TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  date_completed TIMESTAMP WITH TIME ZONE,
  vehicle_state JSONB,
  status TEXT NOT NULL DEFAULT 'pending',
  notes TEXT,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT valid_status CHECK (status IN ('pending', 'in-progress', 'awaiting-parts', 'completed'))
);

-- Create repair_items table
CREATE TABLE IF NOT EXISTS repair_items (
  record_id UUID REFERENCES service_records(id) ON DELETE CASCADE,
  item_label TEXT NOT NULL,
  item_value TEXT NOT NULL,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
  PRIMARY KEY (record_id, item_value)
);

-- Create fleet_count table
CREATE TABLE IF NOT EXISTS fleet_count (
  id SERIAL PRIMARY KEY,
  bird_units INTEGER NOT NULL DEFAULT 0,
  emoob_units INTEGER NOT NULL DEFAULT 0,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Enable Row Level Security for all tables
ALTER TABLE service_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE repair_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE fleet_count ENABLE ROW LEVEL SECURITY;

-- Create policies for service_records
CREATE POLICY "Users can view their own records"
  ON service_records
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own records"
  ON service_records
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own records"
  ON service_records
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own records"
  ON service_records
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for repair_items
CREATE POLICY "Users can view their own repair items"
  ON repair_items
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own repair items"
  ON repair_items
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own repair items"
  ON repair_items
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own repair items"
  ON repair_items
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create policies for fleet_count
CREATE POLICY "Users can view their own fleet count"
  ON fleet_count
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own fleet count"
  ON fleet_count
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own fleet count"
  ON fleet_count
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own fleet count"
  ON fleet_count
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for better performance
CREATE INDEX idx_service_records_user_id ON service_records(user_id);
CREATE INDEX idx_service_records_status ON service_records(status);
CREATE INDEX idx_repair_items_user_id ON repair_items(user_id);
CREATE INDEX idx_fleet_count_user_id ON fleet_count(user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = CURRENT_TIMESTAMP;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_fleet_count_updated_at
  BEFORE UPDATE ON fleet_count
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();