'use server'
 
import { getWeeklyTopSongs } from "@/utils/lastfmAPI"
import SpotifyWebApi from 'spotify-web-api-node'

export async function getSpotifyEmbedLink() {
    const res = await getWeeklyTopSongs('TaRaT_122');
    var weeklyTrack = null;

    if (res && res.length > 1) {
        weeklyTrack = res.slice(1, 4)[0];
    }

    if(weeklyTrack === null) {
        return `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/0xfjrxk4uQpPYCfAMSkiKA?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
    }

    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: 'https://www.tarat.space/'
    });
    
    const response = await spotifyApi.clientCredentialsGrant();

    spotifyApi.setAccessToken(response.body['access_token']);

    const searchResponse = await spotifyApi.searchTracks('track:' + weeklyTrack.name + ' artist:' + weeklyTrack.artist['#text']);


    const externalUrl = searchResponse.body.tracks.items[0].external_urls.spotify;
    const topSongId = searchResponse.body.tracks.items[0].id;

    const embedResponse = await fetch(`https://open.spotify.com/oembed?url=${externalUrl}`, {
        method: "GET",
      })

    const embedData = await embedResponse.json();

    return embedData.html;
}