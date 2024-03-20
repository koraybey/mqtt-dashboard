use crate::models::LogMessage;
use crate::schema::devices::dsl::*;
use diesel::connection::DefaultLoadingMode;
use diesel::prelude::*;
use diesel::SqliteConnection;
use juniper::{
    graphql_object, EmptyMutation, EmptySubscription, FieldError, FieldResult,
};

use crate::database::SqlitePool;

pub struct GraphQLContext {
    pub pool: SqlitePool,
}

impl juniper::Context for GraphQLContext {}

pub struct QueryRoot;

#[graphql_object(Context = GraphQLContext)]
impl QueryRoot {
    fn logs(context: &GraphQLContext) -> FieldResult<Vec<LogMessage>> {
        let connection: &mut SqliteConnection = &mut context.pool.get().unwrap();
        let res = devices
            .load_iter::<LogMessage, DefaultLoadingMode>(connection)?
            .take(100)
            .collect::<QueryResult<Vec<_>>>()?;
        handle_graphql_res(Ok(res))
    }
}

pub type Schema = juniper::RootNode<
    'static,
    QueryRoot,
    EmptyMutation<GraphQLContext>,
    EmptySubscription<GraphQLContext>,
>;

pub fn create_schema() -> Schema {
    Schema::new(QueryRoot, EmptyMutation::new(), EmptySubscription::new())
}

fn handle_graphql_res<T>(res: Result<T, diesel::result::Error>) -> FieldResult<T> {
    match res {
        Ok(t) => Ok(t),
        Err(e) => FieldResult::Err(FieldError::from(e)),
    }
}
