import SDK, {AuthData} from '@ringcentral/sdk';
import {events} from '@ringcentral/sdk/lib/platform/Platform';
import localforage from 'localforage';

// global constants
const authCodeKey = 'ringcentral-token-management-demo-auth-code';
const tokenKey = 'ringcentral-token-management-demo-token';
const redirectUri = window.location.origin + window.location.pathname;

// initiate RingCentral SDK
const rcsdk = new SDK({
  server: process.env.RINGCENTRAL_SERVER_URL,
  clientId: process.env.RINGCENTRAL_CLIENT_ID,
  clientSecret: process.env.RINGCENTRAL_CLIENT_SECRET,
});
const platform = rcsdk.platform();

// save token whenever login success or refresh success
const saveToken = async (res: Response) => {
  const token = await res.clone().json();
  await localforage.setItem(tokenKey, token);
};
platform.on(events.refreshSuccess, async res => {
  saveToken(res);
});
platform.on(events.loginSuccess, async res => {
  saveToken(res);
});

// fetch call logs
const fetchCallLogs = async () => {
  const r = await platform.get('/restapi/v1.0/account/~/extension/~/call-log');
  console.log(await r.json());
};

// add login link to page to let user click to login
const addLoginLink = () => {
  const loginUrl = platform.loginUrl({
    redirectUri,
  });
  console.log(loginUrl);
  const link = document.createElement('a');
  link.href = '#';
  link.innerText = 'Login';
  document.body.appendChild(link);
  link.onclick = () => {
    const popupWindow = window.open(
      loginUrl,
      'windowName',
      'width=300,height=400'
    );
    const handle = setInterval(async () => {
      const code = (await localforage.getItem(authCodeKey)) as string;
      if (code !== null) {
        popupWindow?.close();
        link.remove();
        clearInterval(handle);
        await platform.login({code, redirect_uri: redirectUri});
        await fetchCallLogs();
      }
    }, 1000);
  };
};

(async () => {
  // fetch code from query parameters and save it
  const urlSearchParams = new URLSearchParams(
    new URL(window.location.href).search
  );
  const code = urlSearchParams.get('code');
  if (code !== null) {
    await localforage.setItem(authCodeKey, code);
    return; // because this is the popup window.
  }

  // load saved token and fetch call logs.
  const token = (await localforage.getItem(tokenKey)) as AuthData;
  if (token === null) {
    addLoginLink();
  } else {
    platform.auth().setData(token);
    try {
      await platform.refresh();
      await fetchCallLogs();
    } catch (e) {
      console.log(e); // most likely refresh token expired
      addLoginLink();
    }
  }
})();
