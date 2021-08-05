import SDK from '@ringcentral/sdk';

const redirectUri = window.location.origin + window.location.pathname;

const rcsdk = new SDK({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
  redirectUri
});

const platform = rcsdk.platform();

let urlSearchParams = new URLSearchParams(new URL(window.location.href).search);
const code = urlSearchParams.get('code');

if(code === null) {
  // login
  const loginUrl = platform.loginUrl({
    redirectUri
  });
  console.log(loginUrl);
} else {
  // exchange code for token
}
