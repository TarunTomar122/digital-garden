declare module 'spotify-web-api-node' {
    export default class SpotifyWebApi {
        constructor(credentials: {
            clientId: string;
            clientSecret: string;
            redirectUri: string;
        });
        clientCredentialsGrant(): Promise<{ body: { access_token: string } }>;
        setAccessToken(token: string): void;
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
} 