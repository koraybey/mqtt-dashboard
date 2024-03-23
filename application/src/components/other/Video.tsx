import ReactPlayer from 'react-player/lazy'

export const Video = () => (
    <div className={'w-full h-full border rounded-lg dark:bg-zinc-950 overf'}>
        <ReactPlayer
            playing
            stopOnUnmount
            muted
            width={'100%'}
            height={'100%'}
            playsinline
            url={
                'http://10.147.17.93:8083/stream/home/channel/0/hls/live/index.m3u8'
            }
        />
    </div>
)
