use crate::context::GraphQLContext;
use crate::database::SqlitePool;
use crate::gql::{create_schema, Schema};

use actix_web::web::Data;
use actix_web::{get, route, web, Error, HttpResponse, Responder};
use actix_web_lab::respond::Html;
use juniper::http::playground::playground_source;
use juniper::http::GraphQLRequest;
use std::sync::Arc;

#[get("/playground")]
async fn graphql_playground() -> impl Responder {
    Html(playground_source("/graphql", None))
}

#[route("/graphql", method = "GET", method = "POST")]
async fn graphql(
    pool: web::Data<SqlitePool>,
    schema: web::Data<Arc<Schema>>,
    data: web::Json<GraphQLRequest>,
) -> Result<HttpResponse, Error> {
    let ctx = GraphQLContext {
        pool: pool.get_ref().to_owned(),
    };

    let res = data.execute(&schema, &ctx).await;

    Ok(HttpResponse::Ok()
        .content_type("application/json")
        .json(res))
}

pub fn register(config: &mut web::ServiceConfig) {
    config
        .app_data(Data::new(Arc::new(create_schema())))
        .service(graphql)
        .service(graphql_playground);
}
