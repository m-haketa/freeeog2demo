import { Express } from 'express';
import passport from 'passport';
import oauth, { VerifyCallback, Strategy } from 'passport-oauth2';

import { token, Token } from './token';
import { urls, callbackPath, authPath, providerName } from '@server/const';

import clientData from '../clientdata.json';

export const oauth2strategy: Strategy = new oauth.Strategy(
  {
    ...clientData,
    ...urls, //baseURLは不要だが面倒なので除外せずに引数として渡す
    //state: 'testtesttest',
  },
  (
    accessToken: string,
    refreshToken: string,
    params: Omit<Token, 'refresh_token'>,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    profile: any,
    done: VerifyCallback
  ) => {
    try {
      //なぜかparamsにrefresh_tokenが入っていないので追加
      token.set({ ...params, refresh_token: refreshToken });
      done(undefined, params);
    } catch (e) {
      done(e, undefined);
    }
  }
);

export const oauth2init = (
  app: Express,
  successRedirect: string,
  failureRedirect: string
): void => {
  passport.use(providerName, oauth2strategy);
  app.use(passport.initialize());

  app.get(
    authPath,
    passport.authenticate(providerName, {
      session: false,
    })
  );

  app.get(
    callbackPath,
    passport.authenticate(providerName, {
      successRedirect,
      failureRedirect,
      session: false,
    })
  );
};
