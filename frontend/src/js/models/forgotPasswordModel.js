import { sendResetEmailDB } from '../api';

export const sendResetEmail = async function (email) {
  try {
    await sendResetEmailDB(email);
  } catch (err) {
    throw err;
  }
};
