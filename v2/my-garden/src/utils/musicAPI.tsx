export const getLatestTracks = async (id: string) => {

    try {
        // make a fetch request to the last.fm api to get the latest tracks
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getrecenttracks&user=${id}&api_key=a27681a4a698fe150f9f60e6f4e4a771&format=json&limit=4`, { cache: 'no-store' })
        const data = await response.json()

        // return the tracks
        return data.recenttracks.track
    } catch {
        return []
    }

}

export const getWeeklyTopSongs = async (id: string) => {

    try {
        // make a fetch request to the last.fm api to get the weekly top songs
        const response = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=${id}&api_key=a27681a4a698fe150f9f60e6f4e4a771&format=json&limit=5`, { cache: 'no-store' })
        const data = await response.json()
        // return the tracks
        return data.weeklytrackchart.track
    } catch {
        return []
    }

}