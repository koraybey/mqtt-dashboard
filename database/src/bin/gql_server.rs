extern crate actix_rt;
extern crate actix_web;
extern crate diesel;
extern crate dotenv;
extern crate juniper;

use actix_cors::Cors;
use actix_web::{middleware::Logger, web::Data, App, HttpServer};
use mqtt_sqlite::{database::get_connection_pool, gql_endpoints::register};

#[actix_rt::main]
async fn main() -> std::io::Result<()> {
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("error"));

    // Instantiate a new connection pool
    let pool = get_connection_pool();

    HttpServer::new(move || {
        App::new()
            .app_data(Data::new(pool.clone()))
            .configure(register)
            .wrap(Cors::permissive())
            .wrap(Logger::default())
    })
    .bind(("127.0.0.1", 4000))?
    .run()
    .await
}
