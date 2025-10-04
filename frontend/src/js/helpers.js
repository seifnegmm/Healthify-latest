import x2js from 'x2js';
import { CLIENT_ID, TIMEOUT_SEC, TOKEN_API_URL } from './config';

const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`Request took too long! Timeout after ${seconds} seconds`)
      );
    }, seconds * 1000);
  });
};

/**
 *
 * @param {*} XMLdata
 * @returns JSON formatted data
 */
export const XMLToJSON = function (data) {
  const X2JS = new x2js();
  const jsonData = X2JS.xml2js(data);
  return jsonData;
};

export const getJSON = async function (url, accessToken, params = {}, TCX = false) {
  try {
    const queryString = new URLSearchParams(params).toString();
    const finalUrl = queryString ? `${url}?${queryString}` : url;

    const headers = new Headers();
    headers.append('Authorization', `Bearer ${accessToken}`);
    if (TCX) headers.append('Content-Type', 'application/xml');

    const options = { headers };

    const res = await Promise.race([fetch(finalUrl, options), timeout(TIMEOUT_SEC)]);
    const data = TCX ? await res.text() : await res.json();

    if (!res.ok)
      throw new Error(`Request failed: ${data.message || res.statusText} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};


export const putJSON = async function (url, accessToken, contentLength) {
  try {
    const headers = new Headers();

    headers.append('Authorization', `Bearer ${accessToken}`);
    headers.append('Content-length', `${contentLength}`);
    headers.append('Content-Type', 'application/json');

    const options = {
      method: 'POST',
      headers,
    };

    const res = await Promise.race([fetch(url, options), timeout(TIMEOUT_SEC)]);
    const data = await res.json();

    if (!res.ok)
      throw new Error(`Request failed: ${data.message} (${res.status})`);

    return data;
  } catch (err) {
    throw err;
  }
};

export async function getFitbitAccessToken(authorizationCode, codeVerifier) {
  const url = TOKEN_API_URL;

  const requestBody = new URLSearchParams();
  requestBody.append('client_id', CLIENT_ID);
  requestBody.append('code', authorizationCode);
  requestBody.append('code_verifier', codeVerifier);
  requestBody.append('grant_type', 'authorization_code');

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');

  const options = {
    method: 'POST',
    headers: headers,
    body: requestBody,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Unable to get the access token from the API');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export async function getFitbitRefreshAccessToken(refreshToken) {
  const url = TOKEN_API_URL;

  const requestBody = new URLSearchParams();
  requestBody.append('grant_type', 'refresh_token');
  requestBody.append('client_id', CLIENT_ID);
  requestBody.append('refresh_token', refreshToken);

  const headers = new Headers();
  headers.append('Content-Type', 'application/x-www-form-urlencoded');

  const options = {
    method: 'POST',
    headers: headers,
    body: requestBody,
  };

  try {
    const response = await fetch(url, options);
    if (!response.ok) {
      throw new Error('Unable to get the access token from the API');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error:', error);
    throw error;
  }
}

export function getAuthCodeFromUrl(url) {
  const regex = /[?&]code=([^&]+)/;
  const match = url.match(regex);
  return match ? match[1] : null;
}

export function generateCodeVerifier() {
  const length = Math.floor(Math.random() * (128 - 43 + 1)) + 43;
  const charset =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~';
  let verifier = '';
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * charset.length);
    verifier += charset[randomIndex];
  }
  return verifier;
}

export async function generateSha256(plain) {
  const encoder = new TextEncoder();
  const data = encoder.encode(plain);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => String.fromCharCode(b)).join('');
}

export function generateBase64URLEncode(str) {
  return btoa(str).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}
