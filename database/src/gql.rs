use crate::models::DeviceInfo;
use crate::models::Devices;
use crate::models::LogMessage;
use crate::schema::devices::dsl::*;
use diesel::prelude::*;
use diesel::SqliteConnection;
use juniper::{
    graphql_object, EmptyMutation, EmptySubscription, FieldError, FieldResult,
};
use std::fs;

use crate::database::SqlitePool;

pub struct GraphQLContext {
    pub pool: SqlitePool,
}

pub struct Query;
pub struct DevicesQuery;

#[graphql_object(Context = GraphQLContext)]
impl Query {
    fn logs(context: &GraphQLContext) -> FieldResult<Vec<LogMessage>> {
        let connection: &mut SqliteConnection = &mut context.pool.get().unwrap();
        let res = devices.order(id.desc()).limit(50).load(connection);
        handle_graphql_res(res)
    }
    fn devices() -> Vec<DeviceInfo> {
        let path = "./devices.json";
        let data = fs::read_to_string(path).expect("Unable to read file");
        let res: Devices = serde_json::from_str(&data).expect("Unable to parse");
        let all_devices: Vec<DeviceInfo> = res.devices;
        return all_devices;
    }
}

pub type Schema = juniper::RootNode<
    'static,
    Query,
    EmptyMutation<GraphQLContext>,
    EmptySubscription<GraphQLContext>,
>;

pub fn create_schema() -> Schema {
    Schema::new(Query, EmptyMutation::new(), EmptySubscription::new())
}

fn handle_graphql_res<T>(res: Result<T, diesel::result::Error>) -> FieldResult<T> {
    match res {
        Ok(t) => Ok(t),
        Err(e) => FieldResult::Err(FieldError::from(e)),
    }
}
