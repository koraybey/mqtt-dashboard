use crate::schema::*;
use juniper::GraphQLObject;
use serde::Deserialize;

#[derive(GraphQLObject, Deserialize)]
pub struct DeviceInfo {
    pub topic: String,
    pub alias: String,
    pub device_type: String,
    pub qos: i32,
}

#[derive(GraphQLObject, Deserialize)]
pub struct Devices {
    pub host: String,
    pub protocol: String,
    pub port: i32,
    pub devices: Vec<DeviceInfo>,
}

#[derive(Queryable, Selectable, GraphQLObject)]
#[diesel(table_name = logs)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct LogMessage {
    #[graphql(skip)]
    pub id: i32,
    pub friendly_name: Option<String>,
    pub current: Option<f64>,
    pub energy: Option<f64>,
    pub power: Option<f64>,
    pub last_seen: Option<String>,
    pub voltage: Option<i32>,
    pub linkquality: Option<i32>,
    pub state: Option<String>,
    pub contact: Option<bool>,
    pub occupancy: Option<bool>,
    pub battery: Option<i32>,
    pub illuminance: Option<i32>,
    pub device_temperature: Option<f64>,
    pub power_outage_count: Option<i32>,
    pub timestamp: String,
}

#[derive(Insertable, Deserialize)]
#[diesel(table_name = logs)]
pub struct NewLogMessage {
    pub friendly_name: Option<String>,
    pub current: Option<f64>,
    pub energy: Option<f64>,
    pub power: Option<f64>,
    pub last_seen: Option<String>,
    pub voltage: Option<i32>,
    pub linkquality: Option<i32>,
    pub state: Option<String>,
    pub contact: Option<bool>,
    pub occupancy: Option<bool>,
    pub battery: Option<i32>,
    pub illuminance: Option<i32>,
    pub device_temperature: Option<f64>,
    pub power_outage_count: Option<i32>,
}
