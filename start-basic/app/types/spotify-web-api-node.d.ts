declare module 'spotify-web-api-node' {
  class SpotifyWebApi {
    constructor(credentials?: {
      clientId?: string;
      clientSecret?: string;
      redirectUri?: string;
    });

    setAccessToken(token: string): void;
    clientCredentialsGrant(): Promise<{ body: { access_token: string } }>;
    searchTracks(query: string): Promise<{
      body: {
        tracks: {
          items: Array<{
            external_urls: {
              spotify: string;
            };
          }>;
        };
      };
    }>;
  }

  export default SpotifyWebApi;
} 