use crate::schema::devices;
use juniper::GraphQLObject;

#[derive(Queryable, Selectable, GraphQLObject)]
#[diesel(table_name = devices)]
#[diesel(check_for_backend(diesel::sqlite::Sqlite))]
pub struct LogMessage {
    #[graphql(skip)]
    pub id: i32,
    pub topic: String,
    pub payload: String,
    pub date: chrono::NaiveDateTime,
}

#[derive(Insertable)]
#[diesel(table_name = devices)]
pub struct NewLogMessage<'a> {
    pub topic: &'a str,
    pub payload: &'a str,
}
