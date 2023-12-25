export const getLatestTracks = async (id: string) => {

    // make a fetch request to the last.fm api to get the latest tracks
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${id}&api_key=${process.env.LASTFM_API_KEY}&format=json&limit=2`, { cache: 'no-store' })
    const data = await response.json()

    // return the tracks
    return data.recenttracks.track

}

export const getWeeklyTopSongs = async (id: string) => {

    // make a fetch request to the last.fm api to get the weekly top songs
    const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=${id}&api_key=${process.env.LASTFM_API_KEY}&format=json&limit=3`, { cache: 'no-store' })
    const data = await response.json()

    console.log(data.weeklytrackchart)

    // return the tracks
    return data.weeklytrackchart.track

}