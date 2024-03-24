use diesel::prelude::*;
use diesel::r2d2::ConnectionManager;
use diesel::r2d2::Pool;
use mqtt_sqlite::database::get_connection_pool;
use mqtt_sqlite::models::Devices;
use mqtt_sqlite::models::NewLogMessage;
use mqtt_sqlite::schema::*;

use paho_mqtt::{Client, ConnectOptionsBuilder, Message};
use std::fs;
use std::{process, thread, time::Duration};

fn main() {
    let pool: Pool<ConnectionManager<SqliteConnection>> = get_connection_pool();
    let connection: &mut SqliteConnection = &mut pool.get().unwrap();

    let data = fs::read_to_string("devices.json").expect("Unable to read file");
    let devices: Devices =
        serde_json::from_str(&data).expect("Unable to read device configuration");
    let broker = format!("{}://{}:{}", devices.protocol, devices.host, devices.port);

    let cli = Client::new(broker).unwrap_or_else(|err| {
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
            subscribe(&cli, &devices);
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
                    subscribe(&cli, &devices);
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

fn subscribe(cli: &Client, devices: &Devices) {
    let mut topics: Vec<String> = vec![];
    let mut topics_qos: Vec<i32> = vec![];

    for device in &devices.devices {
        topics.push(device.topic.clone());
        topics_qos.push(device.qos);
    }

    match cli.subscribe_many(&topics, &topics_qos) {
        Ok(_) => println!("Successfully subscribed to {:?}", topics),
        Err(e) => {
            eprintln!("Error subscribing to topic: {:?}", e);
            process::exit(1);
        }
    }
}

fn create_message(connection: &mut SqliteConnection, message: Message) {
    let v: NewLogMessage = serde_json::from_str(&message.payload_str()).unwrap();

    let new_message = NewLogMessage {
        friendly_name: Some(message.topic().to_string()),
        current: v.current,
        energy: v.energy,
        power: v.power,
        last_seen: v.last_seen,
        voltage: v.voltage,
        linkquality: v.linkquality,
        state: v.state,
        contact: v.contact,
        occupancy: v.occupancy,
        battery: v.battery,
        illuminance: v.illuminance,
        device_temperature: v.device_temperature,
        power_outage_count: v.power_outage_count,
    };

    diesel::insert_into(logs::table)
        .values(new_message)
        .execute(connection)
        .expect("Error saving the message");
}
