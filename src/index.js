import SDK from '@ringcentral/sdk';

const redirectUri = window.location.origin + window.location.pathname;

const rcsdk = new SDK({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});

const platform = rcsdk.platform();

const urlSearchParams = new URLSearchParams(new URL(window.location.href).search);
const code = urlSearchParams.get('code');

if(code === null) {
  // login
  const loginUrl = platform.loginUrl({
    redirectUri
  });
  console.log(loginUrl);
  const link = document.createElement('a');
  link.href = loginUrl;
  link.innerText = 'Login';
  document.body.appendChild(link);
} else {
  // exchange code for token
  (async () => {
    const resp = await platform.login({code, redirect_uri: redirectUri});
    const token = await resp.json();
    console.log(token);
    const r = await platform.get('/restapi/v1.0/account/~/extension/~/call-log');
    console.log(await r.json());
  })();
}
