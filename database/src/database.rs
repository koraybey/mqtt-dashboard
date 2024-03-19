use diesel::{
    r2d2::{ConnectionManager, Pool},
    sqlite::SqliteConnection,
};
use dotenv::dotenv;
use std::env;

type SqlitePool = Pool<ConnectionManager<SqliteConnection>>;

pub fn establish_connection() -> SqlitePool {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<SqliteConnection>::new(database_url);
    Pool::builder()
        .build(manager)
        .expect("Failed to create pool.")
}
