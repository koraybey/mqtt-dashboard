import Hls from 'hls.js'
import { useEffect, useRef } from 'react'

const hls = new Hls()

export const Video: React.FC = () => {
    const videoReference = useRef<HTMLVideoElement>(null)

    useEffect(() => {
        if (Hls.isSupported()) {
            hls.loadSource(
                'http://dashboard.perseus.digital:8083/stream/home/channel/0/hls/live/index.m3u8'
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
            style={{
                height: '100%',
                width: '100%',
                objectFit: 'cover',
                borderRadius: 8,
            }}
        ></video>
    )
}
