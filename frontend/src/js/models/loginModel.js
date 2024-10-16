import { createUserDB, loginDB } from '../api.js';
import {
  generateCodeVerifier,
  generateSha256,
  generateBase64URLEncode,
  getFitbitAccessToken,
  getAuthCodeFromUrl,
  getFitbitRefreshAccessToken,
  getJSON,
} from '../helpers.js';
import {
  CLIENT_ID,
  ACCESS_TOKEN_EXPIRY_TIME,
  API_FITBIT_URL,
} from '../config.js';
import User from '../user.js';

export let state = {
  codeVerifier: '',
  hashedVerifier: '',
  codeChallenge: '',
  userID: '',
  accessTokenData: {
    hasAccessToken: false,
    accessToken: '',
  },
  refreshToken: '',
};

let users = [];

export const getAccessToken = async function () {
  try {
    const data = await getFitbitAccessToken(state.authCode, state.codeVerifier);

    state.userID = data.user_id;
    state.accessTokenData.accessToken = data.access_token;
    state.accessTokenData.hasAccessToken = true;
    state.refreshToken = data.refresh_token;

    const { username, email, password } = state.credentials;
    const userData = await getJSON(
      `${API_FITBIT_URL}/${state.userID}/profile.json`,
      state.accessTokenData.accessToken
    );

    const { firstName, fullName } = userData.user;

    const user = new User(
      fullName,
      firstName,
      username,
      email,
      password,
      state.userID,
      state.accessTokenData.accessToken,
      state.refreshToken
    );

    user.accessTokenCreationDate = new Date().getTime();

    await createUserDB(user);
    clearState();
  } catch (err) {
    console.error(err);
    throw err;
  }
};

export const checkLoginCredentials = async function (credentials) {
  try {
    const { token } = await loginDB(credentials);

    localStorage.setItem('JWTToken', JSON.stringify(token));
  } catch (err) {
    throw err;
  }
};

export const getFirstStepVerification = async function (credentials) {
  try {
    const codeVerifier = generateCodeVerifier();
    const hashedVerifier = await generateSha256(codeVerifier);
    const codeChallenge = generateBase64URLEncode(hashedVerifier);

    state.codeVerifier = codeVerifier;
    state.hashedVerifier = hashedVerifier;
    state.codeChallenge = codeChallenge;

    state.credentials = credentials;
    persistState();
  } catch (err) {
    throw err;
  }
};

export const getRedirectUrl = function () {
  return `https://www.fitbit.com/oauth2/authorize?response_type=code&client_id=${CLIENT_ID}&scope=activity+cardio_fitness+heartrate+location+nutrition+profile+settings+weight&code_challenge=${state.codeChallenge}&code_challenge_method=S256&state=255`;
};

export const getAuthCode = function (url) {
  const code = getAuthCodeFromUrl(url);
  state.authCode = code;
  persistState();
};

export const goToMainURL = function () {
  setTimeout(function () {
    window.location.href = `${window.location.protocol}//${window.location.hostname}:${window.location.port}`;
  }, 3000);
};

const persistState = function () {
  sessionStorage.setItem('state', JSON.stringify(state));
};

const clearState = function () {
  sessionStorage.removeItem('state');
};

const init = function () {
  const storageState = sessionStorage.getItem('state');
  if (storageState) state = JSON.parse(storageState);
};

init();
