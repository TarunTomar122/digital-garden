'use server'
 
import { getWeeklyTopSongs } from "@/utils/lastfmAPI"
import SpotifyWebApi from 'spotify-web-api-node'

export async function getSpotifyEmbedLink() {
    const res = await getWeeklyTopSongs('TaRaT_122');
    var weeklyTrack = null;

    if (res && res.length > 1) {
        weeklyTrack = res.slice(1, 4)[0];
    }

    const spotifyApi = new SpotifyWebApi({
        clientId: process.env.SPOTIFY_CLIENT_ID,
        clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
        redirectUri: 'https://www.tarat.space/'
    });
    
    const response = await spotifyApi.clientCredentialsGrant();

    spotifyApi.setAccessToken(response.body['access_token']);

    const searchResponse = await spotifyApi.searchTracks('track:' + weeklyTrack.name + ' artist:' + weeklyTrack.artist['#text']);

    // console.log(searchResponse.body.tracks.items[0]);

    const externalUrl = searchResponse.body.tracks.items[0].external_urls.spotify;
    const topSongId = searchResponse.body.tracks.items[0].id;

    // make a request to https://open.spotify.com/oembed
    // to get the embed link for the song
    // https://open.spotify.com/oembed?url=spotify:track:7tbzfR8ZvZzJEzy6v0d6el

    const embedResponse = await fetch(`https://open.spotify.com/oembed?url=${externalUrl}`, {
        method: "GET",
      })

    const embedData = await embedResponse.json();

    return embedData.html;


    //<iframe style="border-radius:12px" src="https://open.spotify.com/embed/track/7tbzfR8ZvZzJEzy6v0d6el?utm_source=generator" width="100%" height="152" frameBorder="0" allowfullscreen="" allow="autoplay; clipboard-write; encrypted-media; fullscreen; picture-in-picture" loading="lazy"></iframe>


    // // Retrieve an access token.
    // spotifyApi.clientCredentialsGrant().then(
    //     function(data) {

    //       // Save the access token so that it's used in future calls
    //       spotifyApi.setAccessToken(data.body['access_token']);

    //       spotifyApi.searchTracks('track:' + weeklyTrack.name + ' artist:' + weeklyTrack.artist['#text']).then(
    //         function(data) {
    //             return data.body.tracks.items[0].id;
    //           }, function(err) {
    //             return err;
    //     })

    //     },
    //     function(err) {
    //       console.log('Something went wrong when retrieving an access token', err);
    //     }
    // );
    

}