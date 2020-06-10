import refresh from 'passport-oauth2-refresh';

import { oauth2strategy } from './oauth2';
import { Token } from './token';
import { providerName } from '@server/const';

refresh.use(providerName, oauth2strategy);

//providerNameは、ここで埋めておく
export const refreshToken = (refreshToken: string): Promise<Token> => {
  const token = new Promise<Token>((res, rej) => {
    refresh.requestNewAccessToken(
      providerName,
      refreshToken,
      (err, access_token, refresh_token, result) => {
        if (err) {
          rej(err);
        }
        const token_refreshed = { ...result, refresh_token: refresh_token };
        //refreshにrefresh_tokenが入っていないので追加
        res(token_refreshed);
      }
    );
  });

  return token;
};
