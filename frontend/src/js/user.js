export default class User {
  accessTokenCreationDate;
  constructor(
    fullName,
    firstName,
    username,
    email,
    password,
    userID,
    accessToken,
    refreshToken
  ) {
    this.fullName = fullName;
    this.firstName = firstName;
    this.username = username;
    this.email = email;
    this.password = password;
    this.userID = userID;
    this.accessToken = accessToken;
    this.refreshToken = refreshToken;
  }
}
