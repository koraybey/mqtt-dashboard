use diesel::prelude::*;
use diesel::r2d2::ConnectionManager;
use diesel::r2d2::Pool;
use mqtt_sqlite::database::*;
use mqtt_sqlite::models::*;
use mqtt_sqlite::schema::*;

use paho_mqtt::{Client, ConnectOptionsBuilder, Message};
use std::{process, thread, time::Duration};

// ! TODO Read devices.json file or create a device conf setup
const BROKER: &str = "ws://10.147.17.93:1881";
const TOPICS: &[&str] = &[
    "zigbee2mqtt/0_contact_fridge",
    "zigbee2mqtt/0_contact_door",
    "zigbee2mqtt/0_contact_balcony",
    "zigbee2mqtt/1_contact_balcony",
    "zigbee2mqtt/0_plug_studio",
    "zigbee2mqtt/0_plug_camera",
    "zigbee2mqtt/0_plug_alarm",
    "zigbee2mqtt/0_light_studio",
    "zigbee2mqtt/0_motion_salotto",
];
const TOPICS_QOS: &[i32] = &[1, 1, 1, 1, 1, 1, 1, 1, 1];

fn main() {
    let pool: Pool<ConnectionManager<SqliteConnection>> = get_connection_pool();
    let connection: &mut SqliteConnection = &mut pool.get().unwrap();

    let cli = Client::new(BROKER).unwrap_or_else(|err| {
        println!("Error creating the client: {:?}", err);
        process::exit(1);
    });

    let conn_opts = ConnectOptionsBuilder::new()
        .keep_alive_interval(Duration::from_secs(30))
        .clean_session(true)
        .finalize();

    match cli.connect(conn_opts) {
        Ok(_) => {
            println!("Connected to MQTT broker.");
            subscribe(&cli);
        }
        Err(e) => {
            println!("Unable to connect:\n\t{:?}", e);
            process::exit(1);
        }
    }

    let rx: paho_mqtt::Receiver<Option<paho_mqtt::Message>> = cli.start_consuming();

    for message in rx.iter() {
        match message {
            Some(message) => {
                create_message(connection, message);
            }
            None if !cli.is_connected() => {
                if reconnect(&cli) {
                    println!("Resubscribing after reconnection...");
                    subscribe(&cli);
                } else {
                    break;
                }
            }
            _ => (),
        };
    }

    if cli.is_connected() {
        println!("Disconnecting");
        cli.unsubscribe("zigbee2mqtt").unwrap_or_else(|err| {
            println!("Error unsubscribing during disconnect attempt {:?}", err);
            process::exit(1);
        });
        cli.disconnect(None).unwrap_or_else(|err| {
            println!("Error disconnecting from the client {:?}", err);
            process::exit(1);
        });
    }
    println!("Exiting");
}

fn reconnect(cli: &Client) -> bool {
    println!("Connection lost. Waiting to retry connection...");
    for _ in 0..12 {
        thread::sleep(Duration::from_millis(5000));
        if cli.reconnect().is_ok() {
            println!("Successfully reconnected");
            return true;
        }
    }
    println!("Unable to reconnect after several attempts.");
    false
}

fn subscribe(cli: &Client) {
    match cli.subscribe_many(TOPICS, TOPICS_QOS) {
        Ok(_) => println!("Successfully subscribed to {:?}", TOPICS),
        Err(e) => {
            eprintln!("Error subscribing to topic: {:?}", e);
            process::exit(1);
        }
    }
}

pub fn create_message(connection: &mut SqliteConnection, message: Message) {
    println!("{}", message);

    let new_message = NewLogMessage {
        topic: message.topic(),
        payload: &message.payload_str(),
    };

    diesel::insert_into(devices::table)
        .values(&new_message)
        .execute(connection)
        .expect("Error saving the message");
}
