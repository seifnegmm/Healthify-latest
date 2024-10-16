import dotenv from 'dotenv';

dotenv.config();

console.log(
  `${window.location.protocol}//${window.location.hostname}:${window.location.port}`
);

export const TIMEOUT_SEC = 10;
export const RES_PER_PAGE = 3;
export const CLIENT_ID = process.env.CLIENT_ID;
export const ACCESS_TOKEN_EXPIRY_TIME = 28800;
export const API_URL = 'https://api.fitbit.com/1';
export const API_FITBIT_URL = 'https://api.fitbit.com/1/user';
export const TOKEN_API_URL = 'https://api.fitbit.com/oauth2/token';
export const SUPPORTED_WORKOUTS = ['Walk', 'Bike', 'Weights', 'Run'];
export const MAPBOX_ACCESS_TOKEN = process.env.MAPBOX_ACCESS_TOKEN;
export const HEALTHIFY_API_URL = 'http://127.0.0.1:8000/api/v1';
