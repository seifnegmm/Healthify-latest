import { HEALTHIFY_API_URL } from './config';
import { TIMEOUT_SEC } from './config';
import { sendResetEmail } from './models/forgotPasswordModel';

const timeout = function (seconds) {
  return new Promise(function (_, reject) {
    setTimeout(function () {
      reject(
        new Error(`Request took too long! Timeout after ${seconds} seconds`)
      );
    }, seconds * 1000);
  });
};

export const createUserDB = async function (user) {
  try {
    const url = `${HEALTHIFY_API_URL}/signup`;
    const jsonString = JSON.stringify(user);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = {
      method: 'POST',
      headers,
      body: jsonString,
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

export const loginDB = async function (credentials) {
  try {
    const url = `${HEALTHIFY_API_URL}/login`;
    const jsonString = JSON.stringify(credentials);
    const headers = new Headers({ 'Content-Type': 'application/json' });

    const options = {
      method: 'POST',
      headers,
      body: jsonString,
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

export const getUserDataDB = async function (accessToken) {
  try {
    const url = `${HEALTHIFY_API_URL}/myData`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${accessToken}`);

    const options = {
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

export const updateUserDB = async function (obj, accessToken) {
  try {
    const url = `${HEALTHIFY_API_URL}/myData`;
    const jsonString = JSON.stringify(obj);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${accessToken}`);

    const options = {
      method: 'PATCH',
      headers,
      body: jsonString,
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

export const deleteUserDB = async function (accessToken) {
  try {
    const url = `${HEALTHIFY_API_URL}/deleteMe`;
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');
    headers.append('Authorization', `Bearer ${accessToken}`);

    const options = {
      method: 'DELETE',
      headers,
    };

    const res = await Promise.race([fetch(url, options), timeout(TIMEOUT_SEC)]);

    console.log(res);

    if (!res.ok)
      throw new Error(`Request failed: ${data.message} (${res.status})`);
  } catch (err) {
    throw err;
  }
};

export const sendResetEmailDB = async function (email) {
  try {
    const url = `${HEALTHIFY_API_URL}/forgotPassword`;
    const jsonString = JSON.stringify(email);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = {
      method: 'POST',
      headers,
      body: jsonString,
    };

    const res = await Promise.race([fetch(url, options), timeout(TIMEOUT_SEC)]);

    console.log(res);

    if (!res.ok)
      throw new Error(`Request failed: ${data.message} (${res.status})`);
  } catch (err) {
    throw err;
  }
};

export const resetPasswordDB = async function (password, token) {
  try {
    const url = `${HEALTHIFY_API_URL}/resetPassword/${token}`;
    const jsonString = JSON.stringify(password);
    const headers = new Headers();
    headers.append('Content-Type', 'application/json');

    const options = {
      method: 'PATCH',
      headers,
      body: jsonString,
    };

    const res = await Promise.race([fetch(url, options), timeout(TIMEOUT_SEC)]);

    if (!res.ok)
      throw new Error(`Request failed: ${data.message} (${res.status})`);
  } catch (err) {
    console.log(err);
    throw err;
  }
};
