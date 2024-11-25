import { createClient } from '@libsql/client';
import { ServiceRecord } from '../types';

const client = createClient({
  url: "file:local.db",
});

let isInitialized = false;

// Initialize database tables
export const initDB = async () => {
  if (isInitialized) return;

  try {
    // Create service_records table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS service_records (
        id TEXT PRIMARY KEY,
        model TEXT NOT NULL,
        serial_number TEXT NOT NULL,
        date_received TEXT NOT NULL,
        date_completed TEXT,
        vehicle_state TEXT,
        status TEXT NOT NULL DEFAULT 'pending',
        notes TEXT,
        created_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Create repair_items table with composite primary key
    await client.execute(`
      CREATE TABLE IF NOT EXISTS repair_items (
        record_id TEXT NOT NULL,
        item_label TEXT NOT NULL,
        item_value TEXT NOT NULL,
        FOREIGN KEY (record_id) REFERENCES service_records(id) ON DELETE CASCADE,
        PRIMARY KEY (record_id, item_value)
      )
    `);

    // Create fleet_count table
    await client.execute(`
      CREATE TABLE IF NOT EXISTS fleet_count (
        id INTEGER PRIMARY KEY CHECK (id = 1),
        bird_units INTEGER NOT NULL DEFAULT 0,
        emoob_units INTEGER NOT NULL DEFAULT 0,
        updated_at TEXT DEFAULT CURRENT_TIMESTAMP
      )
    `);

    // Insert default fleet count if not exists
    await client.execute(`
      INSERT OR IGNORE INTO fleet_count (id, bird_units, emoob_units)
      VALUES (1, 0, 0)
    `);

    isInitialized = true;
  } catch (error) {
    console.error('Database initialization error:', error);
    throw error;
  }
};

// Service Records
export const saveServiceRecord = async (record: ServiceRecord): Promise<void> => {
  try {
    if (!isInitialized) {
      await initDB();
    }

    await client.execute({
      sql: `INSERT INTO service_records (
              id, 
              model, 
              serial_number, 
              date_received, 
              date_completed, 
              vehicle_state, 
              status
            ) VALUES (?, ?, ?, ?, ?, ?, ?)`,
      args: [
        record.id,
        record.model,
        record.serialNumber,
        record.dateReceived,
        record.dateCompleted || null,
        record.vehicleState ? JSON.stringify(record.vehicleState) : null,
        record.status
      ]
    });

    // Insert repair items
    for (const item of record.repairItems) {
      await client.execute({
        sql: `INSERT INTO repair_items (record_id, item_label, item_value)
              VALUES (?, ?, ?)`,
        args: [record.id, item.label, item.value]
      });
    }
  } catch (error) {
    console.error('Error saving service record:', error);
    throw error;
  }
};

export const loadServiceRecords = async (): Promise<ServiceRecord[]> => {
  try {
    if (!isInitialized) {
      await initDB();
    }

    const result = await client.execute(`
      SELECT 
        r.*,
        GROUP_CONCAT(
          json_object(
            'id', ri.record_id || '-' || ri.item_value,
            'label', ri.item_label,
            'value', ri.item_value
          )
        ) as repair_items_json
      FROM service_records r
      LEFT JOIN repair_items ri ON r.id = ri.record_id
      GROUP BY r.id
      ORDER BY r.date_received DESC
    `);

    return result.rows.map(row => ({
      id: row.id as string,
      model: row.model as string,
      serialNumber: row.serial_number as string,
      dateReceived: row.date_received as string,
      dateCompleted: row.date_completed as string | undefined,
      vehicleState: row.vehicle_state ? JSON.parse(row.vehicle_state as string) : undefined,
      status: row.status as ServiceRecord['status'],
      repairItems: row.repair_items_json
        ? JSON.parse(`[${row.repair_items_json}]`)
        : []
    }));
  } catch (error) {
    console.error('Error loading service records:', error);
    return [];
  }
};

export const updateServiceRecordStatus = async (
  id: string,
  status: ServiceRecord['status'],
  dateCompleted?: string
): Promise<void> => {
  try {
    if (!isInitialized) {
      await initDB();
    }

    await client.execute({
      sql: `UPDATE service_records 
            SET status = ?, 
                date_completed = ?,
                created_at = CURRENT_TIMESTAMP
            WHERE id = ?`,
      args: [status, dateCompleted || null, id]
    });
  } catch (error) {
    console.error('Error updating service record status:', error);
    throw error;
  }
};

// Fleet Count
export const saveFleetCount = async (birdUnits: number, eMoobUnits: number): Promise<void> => {
  try {
    if (!isInitialized) {
      await initDB();
    }

    await client.execute({
      sql: `INSERT INTO fleet_count (id, bird_units, emoob_units)
            VALUES (1, ?, ?)
            ON CONFLICT (id) DO UPDATE SET
            bird_units = excluded.bird_units,
            emoob_units = excluded.emoob_units,
            updated_at = CURRENT_TIMESTAMP`,
      args: [birdUnits, eMoobUnits]
    });
  } catch (error) {
    console.error('Error saving fleet count:', error);
    throw error;
  }
};

export const loadFleetCount = async () => {
  try {
    if (!isInitialized) {
      await initDB();
    }

    const result = await client.execute(`
      SELECT bird_units, emoob_units
      FROM fleet_count
      WHERE id = 1
    `);

    if (result.rows.length === 0) {
      return { birdUnits: 0, eMoobUnits: 0 };
    }

    return {
      birdUnits: result.rows[0].bird_units as number,
      eMoobUnits: result.rows[0].emoob_units as number
    };
  } catch (error) {
    console.error('Error loading fleet count:', error);
    return { birdUnits: 0, eMoobUnits: 0 };
  }
};