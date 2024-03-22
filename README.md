
![preview](https://github.com/koraybey/mqtt-dashboard/assets/21336342/eb5aec46-cab2-450d-aad2-87e63bd40021)

## Why

Dumping MQTT logs to a Telegram bot does not allow me to derive valuable insights. I want to have more information about my device usage patterns, monitor overall health metrics and control some of my devices remotely.

My previous setup had too many layers of complexity and provided separate services for various use cases. I needed a simpler, centralized solution. Moreover, Apple being Apple™, Apple Home does not work without a Apple HomePod. I am locked out of my devices outside my house, even if my phone is connected to an overlay network. That means I cannot interact with any of my devices without paying for a HomePod.

## Ingredients

- **Server**: [Zigbee2MQTT](https://www.zigbee2mqtt.io/) is unparalleled when it comes to eliminating the need for proprietary Zigbee bridges. Grab a [Raspberry Pi](https://www.raspberrypi.com/) or [HP t530 Thin Client](https://www.ebay.de/itm/144913355269?epid=17016765429) for €30, and install a [MQTT broker](https://www.mosquitto.org/download/)
- **Zigbee adapter**: An adapter compatible Zigbee2MQTT is required. I use [SONOFF Zigbee 3.0 USB Dongle Plus](https://www.amazon.de/-/en/gp/product/B09KXTCMSC?) at home and I find it very reliable
- **Camera with RTSP**: Ideally grab a camera without internet connection. Stay away from unknown and unreliable brands for security reasons. I configured an unused [E1 Pro](https://www.amazon.de/Reolink-%C3%9Cberwachungskamera-Kameramonitor-IR-Nachtsicht-SD-Kartenslot-4mp-Wlan-Kamera-Schwarz/dp/B08S6TKP26) camera I have lying around
- **RTSP to HLS converter**: Video stream must be consumable in browser. Hence, conversion to m3u8 is needed. Previously I hosted ffmpeg instances but currently I use a native converter called [RTSPtoWeb](https://github.com/deepch/RTSPtoWeb)
- **Sensors**: Any compatible with Zigbee2MQTT. Here is a list of supported and affordable [contact](https://www.zigbee2mqtt.io/supported-devices/#v=SONOFF,Aqara&e=contact) and [occupancy](https://www.zigbee2mqtt.io/supported-devices/#e=occupancy&v=SONOFF,Aqara) sensors I previously used
- **Lights** _(or plugs connected to lights)_: For this project, I will use a plug to control the light located in my studio, as I don't want to screw and unscrew my lights. Here is a list of supported and affordable [plugs](https://www.zigbee2mqtt.io/supported-devices/#v=Nous&s=smart%20plug) and [lights](https://www.zigbee2mqtt.io/supported-devices/#s=smart%20light&v=Nous) I previously used

**You need to bring your ingredients and deployment strategies of your choice. This project only contains the React front-end that allows you to monitor health, control devices and watch the stream, and a back-end to process and serve the data end-points.**

> [!CAUTION]  
> It is not advised to expose this dashboard to internet. Use peer-to-peer overlay networks such as [Nebula](https://github.com/slackhq/nebula) to access the local computer where the dashboard is running.

## Preparation

You will need

- [rustup](https://rustup.rs/)
- [node](https://nodejs.org/en/)
- [pnpm](https://pnpm.io/)

You may choose to use [asdf](https://asdf-vm.com/) and use pinned node and pnpm versions for straight-forward application runtime management. However, installing rust via rustup is recommended.

```shell
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf plugin add yarn https://github.com/twuni/asdf-yarn.git
asdf install
```

### Installing dependencies and building the project

Check root and workspace ```package.json``` files to see available scripts.

### Setting up the video stream

Obtain the `.m3u8` URL for your stream and change the existing url in `@/components/Video`.

### Creating database for MQTT logs

Navigate to database directory and run

```shell
cargo install diesel_cli --no-default-features --features sqlite
diesel migration run
```

before starting the other processes.

> [!IMPORTANT]  
> mqtt_logger.rs is scheduled for removal as logger uptime is critical and must run on the server where  the broker is located. For this reason, It will be removed from this project and will be published as systemd service.
