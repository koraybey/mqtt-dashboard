CREATE TABLE logs (
    id INTEGER PRIMARY KEY AUTOINCREMENT NOT NULL,
    friendly_name TEXT, 
    current DOUBLE,
    energy DOUBLE,
    power DOUBLE,
    last_seen TEXT,
    voltage INTEGER,
    linkquality INTEGER,
    state TEXT,
    contact BOOLEAN,
    occupancy BOOLEAN,
    battery INTEGER,
    illuminance INTEGER,
    device_temperature DOUBLE,
    power_outage_count INTEGER,
    timestamp TEXT NOT NULL DEFAULT (strftime('%Y-%m-%dT%H:%M:%fZ', 'now'))
)