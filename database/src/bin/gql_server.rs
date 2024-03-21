use std::sync::Arc;

use actix_cors::Cors;
use actix_web::{
    get, middleware, route,
    web::{self, Data},
    App, Error, HttpResponse, HttpServer, Responder,
};
use juniper::http::{graphiql::graphiql_source, GraphQLRequest};
use mqtt_sqlite::{
    database::{get_connection_pool, SqlitePool},
    gql_schemas::{create_schema, GraphQLContext, Schema},
};

use actix_web_lab::respond::Html;

#[get("/graphiql")]
async fn graphql_playground() -> impl Responder {
    Html(graphiql_source("/graphql", None))
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

#[actix_web::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    let pool = get_connection_pool();

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(Arc::new(create_schema())))
            .app_data(Data::new(pool.clone()))
            .service(graphql)
            .service(graphql_playground)
            .wrap(Cors::permissive())
            .wrap(middleware::Logger::default())
    })
    .bind(("127.0.0.1", 4000))?
    .workers(2)
    .run()
    .await
}
