import express, { RequestHandler } from 'express';

import * as apis from '@server/handler/apis';
import * as pages from '@server/handler/pages';

import { token } from './oauth2/token';
import { oauth2init } from './oauth2/oauth2';
import { freeeApiInit } from './freee/api';

const topPage = '/';
const loginPage = '/login';

const app = express();
oauth2init(app, topPage, loginPage);
freeeApiInit(app);

const loginCheckHandler: RequestHandler = (req, res, next) => {
  if (req.url === loginPage || req.token) {
    next();
    return;
  }

  res.redirect(loginPage);
};

app.use(loginCheckHandler);

app.get('/', (req, res) => {
  res.send(
    `<p>トップページです</p>` +
      `<p><a href="/demo/companies">会社一覧</a></p><br />` +
      `<p><a href="/logout">ログアウト</a></p>`
  );
});

app.get(loginPage, (req, res) => {
  if (req.token) {
    res.redirect('/');
  } else {
    res.send(
      '<a href="/auth/provider">ここからfreeeのアクセストークンを取得してください</a>'
    );
  }
});

app.get('/logout', (req, res) => {
  token.clear();
  res.send('logoutしました');
});

//APIで取得したデータをHTMLで表示
app.get('/demo/companies', pages.companies);
app.get('/demo/companies/:companyId/account_items', pages.account_items);
app.get('/demo/account_items/:companyId/:id', pages.account_item);

//APIで取得したデータをJSON形式で返す
app.get('/api/companies', apis.companies);
app.get('/api/companies/:companyId', apis.company);
app.get('/api/account_items/:companyId/:id', apis.account_item);

app.listen(3000, () => {
  console.log(`server running, listening on http://localhost:3000/`);
});
