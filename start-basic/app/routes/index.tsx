import * as React from 'react'
import { Await, createFileRoute } from '@tanstack/react-router'
import Recent from '../components/Recent/recent';
import SpotifyEmbedSkeleton from '../components/SpotifyEmbedSkeleton/spotifyEmbedSkeleton';
import { Suspense } from 'react';
import { createServerFn } from '@tanstack/start'
import { DEPLOY_URL } from '~/utils/users'

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


const getSpotifyEmbedLink = createServerFn({ method: 'GET' }).handler(async () => {
  try {
    const weeklyTrack = await fetchLastFMTrack();

    const embedHtml = await getSpotifyTrackEmbed(
        weeklyTrack.name,
        weeklyTrack.artist['#text']
    );
    console.log('embedHtml', embedHtml);;

    return { html: embedHtml || DEFAULT_EMBED };
} catch (error) {
    console.error('Error in getSpotifyEmbedLink:', error);
    return { html: DEFAULT_EMBED };
}
})

export const Route = createFileRoute('/')({
  loader: async () => {
    const iframeHtml = await getSpotifyEmbedLink();
    return { iframeHtml: iframeHtml.html };
  },
  component: HomeComponent,
})

function HomeComponent() {
  console.log('rendering the home component');
  const { iframeHtml } = Route.useLoaderData();
  return (
    <main className='flex justify-center xl:px-60'>
      <div className='min-w-full md:container md:mt-2 px-8  md:px-28 lg:px-60'>

        {/* Present */}
        <div>
          <section>
            <div className='flex flex-row items-center justify-between'>
              <p className="text-3xl md:text-4xl font-extralight py-4">Present</p>
              <img 
                src="./selfie.png" 
                alt='TaraT' 
                width={64} 
                height={64} 
                className='h-12 md:h-16 rounded-full w-auto'
              />
            </div>
            <section className="text-slate-400 leading-8 text-lg md:leading-10 mt-4 xl:pr-24 font-light">
              <p>Tarat is currently helping ship {" "}
                <span className="border-b-2 border-b-slate-400 text-slate-200">
                  <a href="https://s2.spectrum.adobe.com/index.html" target="_blank">Spectrum 2 @Adobe</a>
                </span> {" "} but also, he is writing weekly newsletters on substack as {" "}
                <span className="border-b-2 border-b-slate-400 text-slate-200">
                  <a href="https://tarat122.substack.com/" target="_blank">tarat's week on internet</a>
                </span>, documenting hobbies on instagram as <span className="border-b-2 border-b-slate-400 text-slate-200">
                  <a href="https://www.instagram.com/tarat.hobbies/" target="_blank">tarat.hobbies</a>
                </span> {", "} <span className="border-b-2 border-b-slate-400 text-slate-200">
                  <a href="/writings">writing blogs</a>
                </span>{", "} <span className="border-b-2 border-b-slate-400 text-slate-200">
                  <a href="/library">reading books</a>
                </span>
                {" and, "}
                <span className="border-b-2 border-b-slate-400 text-slate-200">
                  <a href="/dump">creating half finished projects.</a>
                </span>
              </p>
            </section>
          </section>

          {/* Recent */}
          <section className="py-6">
            <Suspense fallback={
              <>
                <p className="text-3xl md:text-4xl font-extralight py-4">Recent</p>
                <section className="mt-4">
                  <p className="text-slate-400 leading-8 text-lg md:leading-10 xl:pr-24 font-light mb-2">I&apos;ve been recently obsessed with</p>
                  <SpotifyEmbedSkeleton />
                </section>
              </>
            }>
              <Recent iframeHtml={iframeHtml} />
            </Suspense>
          </section>

          {/* Footer */}
          <section className="py-8">
            <p>Made with 💛 by tarat</p>
          </section>


        </div>

      </div>

    </main >
  );
}