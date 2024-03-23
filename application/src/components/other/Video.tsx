import Hls from 'hls.js'
import { useEffect, useRef } from 'react'

const hls = new Hls()

export const Video: React.FC = () => {
    const videoReference = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (Hls.isSupported()) {
            hls.loadSource(
                'http://10.147.17.93:8083/stream/home/channel/0/hls/live/index.m3u8'
            )
            if (!videoReference.current) return
            hls.attachMedia(videoReference.current)
            // hls.on(Hls.Events.ERROR, (err) => {
            //     console.log(err)
            // })
        }
    }, [videoReference])

    return (
        <video
            autoPlay
            muted
            playsInline
            ref={videoReference}
            className={
                'w-full h-full border rounded-lg dark:bg-zinc-950 object-cover'
            }
        ></video>
    )
}
