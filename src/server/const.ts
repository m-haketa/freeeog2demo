export const providerName = 'provider';

export const authPath = `/auth/${providerName}`;
export const callbackPath = `${authPath}/callback`;

export const urls = {
  baseURL: 'https://api.freee.co.jp',
  authorizationURL: 'https://accounts.secure.freee.co.jp/public_api/authorize',
  tokenURL: 'https://accounts.secure.freee.co.jp/public_api/token',
  callbackURL: `http://localhost:3000${callbackPath}`,
};
