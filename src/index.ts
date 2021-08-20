import SDK from '@ringcentral/sdk';
import localforage from 'localforage';

const authCodeKey = 'ringcentral-token-management-demo-auth-code'
const tokenKey = 'ringcentral-token-management-demo-token'

const redirectUri = window.location.origin + window.location.pathname;

const rcsdk = new SDK({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});
const platform = rcsdk.platform();



(async () => {

  const urlSearchParams = new URLSearchParams(new URL(window.location.href).search);
const code = urlSearchParams.get('code');
if(code !== null) {
  await localforage.setItem(authCodeKey, code);
}

})();

if(code === null) {
  // login
  const loginUrl = platform.loginUrl({
    redirectUri
  });
  console.log(loginUrl);
  const link = document.createElement('a');
  link.href = '#';
  link.innerText = 'Login';
  document.body.appendChild(link);
  link.onclick = () => {
    const popupWindow = window.open(loginUrl, 'windowName', "width=300,height=400");
    setInterval(() => {
      console.log(popupWindow.location.href);
    }, 1000)
  };
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
