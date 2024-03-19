use crate::models::LogMessage;
use crate::schema::devices::dsl::*;
use diesel::prelude::*;
use diesel::SqliteConnection;
use juniper::{
    graphql_object, EmptyMutation, EmptySubscription, FieldError, FieldResult,
};

use crate::context::GraphQLContext;

pub struct Query;

#[graphql_object(Context = GraphQLContext)]
impl Query {
    #[graphql(name = "getLogs")]
    pub fn get_logs(context: &GraphQLContext) -> FieldResult<Vec<LogMessage>> {
        let connection: &mut SqliteConnection = &mut context.pool.get().unwrap();
        let res = devices.load::<LogMessage>(connection);
        handle_graphql_res(res)
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
