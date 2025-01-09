'use server'

import SpotifyWebApi from 'spotify-web-api-node';

export async function getSpotifyEmbedLink() {
    try {
        // Get the weekly favourite track from last.fm
        const lastFMResponse = await fetch(`https://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=TaRaT_122&api_key=${process.env.LASTFM_API_KEY}&format=json&limit=5`, { cache: 'no-store' })
        const data = await lastFMResponse.json()
        const res =  data.weeklytrackchart.track
        var weeklyTrack = null;
        if (res && res.length > 1) {
            weeklyTrack = res.slice(1, 4)[0];
        }

        // set a default track if no track is found
        if(weeklyTrack === null) {
            return `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/0xfjrxk4uQpPYCfAMSkiKA?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`
        }

        // Search the track on Spotify
        const spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
            redirectUri: 'https://www.tarat.space/'
        });
        const response = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(response.body['access_token']);
        const searchResponse = await spotifyApi.searchTracks(weeklyTrack.name + weeklyTrack.artist['#text']);

        // console.log('searchResponse', 'track:' + weeklyTrack.name + ' artist:' + weeklyTrack.artist['#text'], weeklyTrack);

        // Get the embed link for the track
        const externalUrl = searchResponse.body.tracks.items[0].external_urls.spotify;
        const embedResponse = await fetch(`https://open.spotify.com/oembed?url=${externalUrl}`, {
            method: "GET",
        });
        const embedData = await embedResponse.json();

        return embedData.html;
    }
    catch (error) {
        console.error('Error in getSpotifyEmbedLink', error);
        return `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/0xfjrxk4uQpPYCfAMSkiKA?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;
    }
}