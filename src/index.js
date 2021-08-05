import SDK from '@ringcentral/sdk';

const rcsdk = new SDK({
  server: SDK.server.sandbox,
  clientId: 'svH9oHPYR_CwZpkop5OXow',
  clientSecret: 'hPFD5hGhR-6wh8vpY91ZPAo3FoMFRRQOmTc-u1jdAaPg',
  redirectUri: 'http://localhost:8080'
});
console.log(rcsdk);
