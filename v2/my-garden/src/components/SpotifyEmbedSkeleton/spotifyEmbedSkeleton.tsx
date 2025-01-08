import './styles.css'

export default function Page() {
    return (
        <div className='embedMain flex flex-row justify-start bg-gray-800'>
            <div className="animate-pulse flex flex-row" style={{ width: '100%' }}>
                <div className="embedImg"></div>
                <div className='embedDetails'>
                    <div className="embedIconContainer">
                        <div className='embedIcon'></div>
                    </div>
                    <div className='embedText'>
                        <p className='embedTitle text-slate-400 text-sm md:text-md font-bold'>Fetching details from the Spotify API</p>
                        <p className='embedArtist text-slate-500 text-sm md:text-md'>@tarat</p>
                    </div>
                </div>
            </div>
        </div>
    )
}