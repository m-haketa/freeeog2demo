import aspida from '@aspida/node-fetch';
import fetch from 'node-fetch';
import api from '@server/aspida/$api';

import { token } from '@server/oauth2/token';

//README.md記載の手順でtoken取得後に実行してください
const sample = async (): Promise<void> => {
  const tokenContainer = await token.get();
  if (tokenContainer.isFailure) {
    throw new Error(tokenContainer.data.message);
  }

  const accessToken = tokenContainer.data.access_token;

  const client = api(
    aspida(fetch, {
      baseURL: 'https://api.freee.co.jp',
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    })
  );

  const companies = await client.api.$1.companies.get();
  console.log(JSON.stringify(companies.body));
};

sample().catch((r) => {
  console.log('error!');
  console.log(r);
});
