'use server'

import SpotifyWebApi from 'spotify-web-api-node';
import { unstable_cache } from 'next/cache';

const DEFAULT_EMBED = `<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/0xfjrxk4uQpPYCfAMSkiKA?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>`;

async function fetchLastFMTrack() {
    try {
        const response = await fetch(
            `https://ws.audioscrobbler.com/2.0/?method=user.getweeklytrackchart&user=TaRaT_122&api_key=${process.env.LASTFM_API_KEY}&format=json&limit=5`,
            { 
                cache: 'no-store',
                next: { revalidate: 0 }  // Force revalidation
            }
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
        if (!process.env.SPOTIFY_CLIENT_ID || !process.env.SPOTIFY_CLIENT_SECRET) {
            throw new Error('Spotify credentials are not configured');
        }
        
        const spotifyApi = new SpotifyWebApi({
            clientId: process.env.SPOTIFY_CLIENT_ID,
            clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
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

export const getSpotifyEmbedLink = unstable_cache(
    async () => {
        const now = new Date().toISOString();
        console.log(`[${now}] Fetching new Spotify embed`);  // Add timestamp logging
        
        try {
            const weeklyTrack = await fetchLastFMTrack();
            
            if (!weeklyTrack) {
                console.log('No weekly track found, using default embed');
                return DEFAULT_EMBED;
            }

            console.log('Found track:', weeklyTrack.name, 'by', weeklyTrack.artist['#text']);

            const embedHtml = await getSpotifyTrackEmbed(
                weeklyTrack.name,
                weeklyTrack.artist['#text']
            );

            return embedHtml || DEFAULT_EMBED;
        } catch (error) {
            console.error('Error in getSpotifyEmbedLink:', error);
            return DEFAULT_EMBED;
        }
    },
    ['spotify-embed'],
    {
        revalidate: 60*60*24,
        tags: ['spotify-embed']
    }
);

export const getTopTrack = unstable_cache(
    async () => {
        try {
            const weeklyTrack = await fetchLastFMTrack();
            if (!weeklyTrack) return null;
  
            return {
                name: weeklyTrack.name as string,
                artist: weeklyTrack.artist['#text'] as string,
            };
        } catch (error) {
            console.error('Error in getTopTrack:', error);
            return null;
        }
    },
    ['spotify-top-track'],
    { revalidate: 60*60*24 }
);

// Uncached variant for always-fresh data
export async function getTopTrackLive() {
    try {
        const weeklyTrack = await fetchLastFMTrack();
        if (!weeklyTrack) return null;
        return {
            name: weeklyTrack.name as string,
            artist: weeklyTrack.artist['#text'] as string,
        };
    } catch (error) {
        console.error('Error in getTopTrackLive:', error);
        return null;
    }
}