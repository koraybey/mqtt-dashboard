use diesel::{
    connection::SimpleConnection,
    r2d2::{ConnectionManager, Pool},
    sqlite::SqliteConnection,
};
use dotenv::dotenv;
use std::{env, time::Duration};

#[derive(Debug)]
pub struct ConnectionOptions {
    pub enable_wal: bool,
    pub enable_foreign_keys: bool,
    pub busy_timeout: Option<Duration>,
}

impl diesel::r2d2::CustomizeConnection<SqliteConnection, diesel::r2d2::Error>
    for ConnectionOptions
{
    fn on_acquire(
        &self,
        conn: &mut SqliteConnection,
    ) -> Result<(), diesel::r2d2::Error> {
        (|| {
            if self.enable_wal {
                conn.batch_execute(
                    "PRAGMA journal_mode = WAL; PRAGMA synchronous = NORMAL;",
                )?;
            }
            if self.enable_foreign_keys {
                conn.batch_execute("PRAGMA foreign_keys = ON;")?;
            }
            if let Some(d) = self.busy_timeout {
                conn.batch_execute(&format!(
                    "PRAGMA busy_timeout = {};",
                    d.as_millis()
                ))?;
            }
            Ok(())
        })()
        .map_err(diesel::r2d2::Error::QueryError)
    }
}

pub type SqlitePool = Pool<ConnectionManager<SqliteConnection>>;

pub fn get_connection_pool() -> SqlitePool {
    dotenv().ok();
    let database_url = env::var("DATABASE_URL").expect("DATABASE_URL must be set");
    let manager = ConnectionManager::<SqliteConnection>::new(database_url);
    Pool::builder()
        .connection_customizer(Box::new(ConnectionOptions {
            enable_wal: true,
            enable_foreign_keys: true,
            busy_timeout: Some(Duration::from_secs(30)),
        }))
        .build(manager)
        .expect("Failed to create pool.")
}
