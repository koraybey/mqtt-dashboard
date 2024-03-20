![Screenshot 2024-03-16 at 05-18-05 Dashboard](https://github.com/koraybey/dashboard/assets/21336342/a5e64390-fe12-4c38-9bf9-5c2ae98f143a)

## Why

Dumping MQTT logs to a Telegram bot does not allow me to derive valuable insights. I want to have more information about my device usage patterns, monitor overall health metrics and control some of my devices remotely.

My previous setup had too many layers of complexity and provided separate services for various use cases. I needed a simpler, centralized solution. Moreover, Apple being Apple™, Apple Home does not work without a Apple HomePod. I am locked out of my devices outside my house, even if my phone is connected to an overlay network. That means I cannot interact with any of my devices without paying for a HomePod.

## Ingredients

-   **Server**: [Zigbee2MQTT](https://www.zigbee2mqtt.io/) is unparalleled when it comes to eliminating the need for proprietary Zigbee bridges. Grab a [Raspberry Pi](https://www.raspberrypi.com/) or [HP t530 Thin Client](https://www.ebay.de/itm/144913355269?epid=17016765429) for €30, and install a [MQTT broker](https://www.mosquitto.org/download/)
-   **Zigbee adapter**: An adapter compatible Zigbee2MQTT is required. I use [SONOFF Zigbee 3.0 USB Dongle Plus](https://www.amazon.de/-/en/gp/product/B09KXTCMSC?) at home and I find it very reliable
-   **Camera with RTSP**: Ideally grab a camera without internet connection. Stay away from unknown and unreliable brands for security reasons. I configured an unused [E1 Pro](https://www.amazon.de/Reolink-%C3%9Cberwachungskamera-Kameramonitor-IR-Nachtsicht-SD-Kartenslot-4mp-Wlan-Kamera-Schwarz/dp/B08S6TKP26) camera I have lying around
-   **RTSP to HLS converter**: Video stream must be consumable in browser. Hence, conversion to m3u8 is needed. Previously I hosted ffmpeg instances but currently I use a native converter called [RTSPtoWeb](https://github.com/deepch/RTSPtoWeb)
-   **Sensors**: Any compatible with Zigbee2MQTT. Here is a list of supported and affordable [contact](https://www.zigbee2mqtt.io/supported-devices/#v=SONOFF,Aqara&e=contact) and [occupancy](https://www.zigbee2mqtt.io/supported-devices/#e=occupancy&v=SONOFF,Aqara) sensors I previously used
-   **Lights** _(or plugs connected to lights)_: For this project, I will use a plug to control the light located in my studio, as I don't want to screw and unscrew my lights. Here is a list of supported and affordable [plugs](https://www.zigbee2mqtt.io/supported-devices/#v=Nous&s=smart%20plug) and [lights](https://www.zigbee2mqtt.io/supported-devices/#s=smart%20light&v=Nous) I previously used

**You need to bring your ingredients and deployment strategies of your choice. This project only contains the React front-end that allows you to monitor health, control devices and watch the stream, and a back-end to process and serve the data end-points.**

> [!CAUTION]  
> It is not advised to expose this dashboard to internet. Use peer-to-peer overlay networks such as [Nebula](https://github.com/slackhq/nebula) to access the local computer where the dashboard is running.

## Preparation

You will need:

-   [node](https://nodejs.org/en/)
-   [yarn](https://yarnpkg.com/)

However, using [asdf](https://asdf-vm.com/) is recommended. By keeping the .tools-versions file up to date, we can keep nodejs and yarn runtime conflicts to minimum.

### Managing dependencies and runtime versions

-   Get asdf [as per the documentation](https://asdf-vm.com/guide/getting-started.html)
-   Install required asdf plugins

```shell
asdf plugin add nodejs https://github.com/asdf-vm/asdf-nodejs.git
asdf plugin add yarn https://github.com/twuni/asdf-yarn.git
```

-   Navigate to project directory and install local runtime versions `asdf install`
-   Install project dependencies from the monorepo root by running`yarn`

### Building for development or production

For development, check scripts of`package.json` found in `application` and `server` packages.
You can build and serve the app from the monorepo root by running `yarn start`.

### Setting up the video stream

Obtain the `.m3u8` URL for your stream and change the existing url in `@/components/Video`.

### Processing logs and creating structured data

> [!IMPORTANT]  
> This express server and data processing methods are set up for demo only. They are scheduled for deprecation in favour of GraphQL and PostgreSQL.

In order to control your MQTT devices, you need to subscribe to topics and publish messages. Therefore, you need to know which topic your device listens. Further information available on Zigbee2MQTT documentation.
Edit `server/devices.json` to define your devices. Your devices must expose `contact: boolean` and `status: "ON | "OFF"` properties.

-   Navigate to `server` package
-   Copy your Zigbee2MQTT `log` to a static folder. If your Zigbee2MQTT is deployed to a server, you can copy the file with `scp`

```shell
scp $USER@$IP:${Zigbee2MQTTLogAbsolutePath}/log.txt /static/log.txt
```

-   Generate data and serve endpoints

```shell
yarn generateJsonFromLog
yarn dev
```
