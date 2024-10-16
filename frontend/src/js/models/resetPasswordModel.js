import { resetPasswordDB } from '../api';

export const resetPassword = async function (password, token) {
  try {
    await resetPasswordDB(password, token);
  } catch (err) {
    throw err;
  }
};
