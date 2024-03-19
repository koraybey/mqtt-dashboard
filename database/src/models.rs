use diesel::{prelude::Insertable, sql_types::Timestamp, Queryable, Selectable};

use crate::schema::devices;

#[derive(Queryable, Selectable)]
#[diesel(table_name = devices)]
pub struct LogMessage {
    pub id: i32,
    pub topic: String,
    pub payload: String,
    pub date: Timestamp,
}

#[derive(Insertable)]
#[diesel(table_name = devices)]
pub struct NewLogMessage<'a> {
    pub topic: &'a str,
    pub payload: &'a str,
}