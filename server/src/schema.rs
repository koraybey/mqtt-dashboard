// @generated automatically by Diesel CLI.

diesel::table! {
    logs (id) {
        id -> Integer,
        friendly_name -> Nullable<Text>,
        current -> Nullable<Double>,
        energy -> Nullable<Double>,
        power -> Nullable<Double>,
        last_seen -> Nullable<Text>,
        voltage -> Nullable<Integer>,
        linkquality -> Nullable<Integer>,
        state -> Nullable<Text>,
        contact -> Nullable<Bool>,
        occupancy -> Nullable<Bool>,
        battery -> Nullable<Integer>,
        illuminance -> Nullable<Integer>,
        device_temperature -> Nullable<Double>,
        power_outage_count -> Nullable<Integer>,
        timestamp -> Text,
    }
}
