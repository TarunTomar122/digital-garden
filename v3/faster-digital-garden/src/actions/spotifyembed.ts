// 'use server'

import SpotifyWebApi from 'spotify-web-api-node';
// import { unstable_cache } from 'next/cache';

const DEFAULT_EMBED = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/0xfjrxk4uQpPYCfAMSkiKA?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;

async function fetchLastFMTrack() {
    try {
        const response = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=TaRaT_122&api_key=${import.meta.env.VITE_LASTFM_API_KEY}&format=json&limit=5`,
            { cache: 'no-store' }
        );
        
        if (!response.ok) {
            throw new Error('LastFM API failed');
        }

        const data = await response.json();
        const tracks = data.weeklytrackchart?.track;
        
        if (!tracks?.length) {
            throw new Error('No tracks found');
        }

        return tracks[0];
    } catch (error) {
        console.error('Error fetching LastFM track:', error);
        return null;
    }
}

async function getSpotifyTrackEmbed(trackName: string, artistName: string) {
    try {
        if (!import.meta.env.VITE_SPOTIFY_CLIENT_ID || !import.meta.env.VITE_SPOTIFY_CLIENT_SECRET) {
            throw new Error('Spotify credentials are not configured');
        }
        
        const spotifyApi = new SpotifyWebApi({
            clientId: import.meta.env.VITE_SPOTIFY_CLIENT_ID,
            clientSecret: import.meta.env.VITE_SPOTIFY_CLIENT_SECRET,
            redirectUri: 'https://www.tarat.space/'
        });

        const response = await spotifyApi.clientCredentialsGrant();
        spotifyApi.setAccessToken(response.body['access_token']);

        const searchResponse = await spotifyApi.searchTracks(`${trackName} ${artistName}`);
        const track = searchResponse.body.tracks.items[0];

        if (!track) {
            throw new Error('No track found on Spotify');
        }

        const embedResponse = await fetch(
            `https://open.spotify.com/oembed?url=${track.external_urls.spotify}`,
            { method: "GET" }
        );

        if (!embedResponse.ok) {
            throw new Error('Failed to get embed data');
        }

        const embedData = await embedResponse.json();
        return embedData.html;
    } catch (error) {
        console.error('Error getting Spotify embed:', error);
        return null;
    }
}

export const getSpotifyEmbedLink = async () => {
        try {
            const weeklyTrack = await fetchLastFMTrack();
            
            if (!weeklyTrack) {
                return DEFAULT_EMBED;
            }

            const embedHtml = await getSpotifyTrackEmbed(
                weeklyTrack.name,
                weeklyTrack.artist['#text']
            );

            // set a timeout of 5 seconds
            await new Promise(resolve => setTimeout(resolve, 10000));

            return embedHtml || DEFAULT_EMBED;
        } catch (error) {
            console.error('Error in getSpotifyEmbedLink:', error);
            return DEFAULT_EMBED;
        }
}