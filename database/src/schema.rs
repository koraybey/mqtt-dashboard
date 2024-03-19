// @generated automatically by Diesel CLI.

diesel::table! {
    devices (id) {
        id -> Integer,
        topic -> Text,
        payload -> Text,
        date -> Timestamp,
    }
}
