# TypeScriptからfreeeAPIを使うデモ

## 使い方

### インストール

このリポジトリをクローン後、必要なファイルをインストール

```
npm install
npm run openapi2aspida
```

### freeeのclient_id、client_secretを取得する

下記手順でclient_id、client_secretを取得してください。

#### 1. freeeアプリストアへのアプリケーション登録

`client_id` および `client_secret` を取得するため、freeeアプリストアの開発者ページでアプリケーションを登録します。

**コールバックURLは、`http://localhost:3080/auth/provider/callback`に設定してください**。

<br >

参考URL↓

[freeeヘルプ-アプリケーションを作成する](https://app.secure.freee.co.jp/developers/tutorials/2-%E3%82%A2%E3%83%97%E3%83%AA%E3%82%B1%E3%83%BC%E3%82%B7%E3%83%A7%E3%83%B3%E3%82%92%E4%BD%9C%E6%88%90%E3%81%99%E3%82%8B)

#### 2. Client ID、Client Secretの取得

下記ページの「1.」で表示されているClient ID、Client Secretを「src/server/clientdata.json」に入力してください。

``` json src/server/clientdata.json
{
  "client_id": "ここにCLIENT_IDを入れる",
  "client_secret": "ここにCLIENT_SECRETを入れる"
}

```

参考URL↓

[freeeヘルプ-アクセストークンを取得する](https://app.secure.freee.co.jp/developers/tutorials/3-アクセストークンを取得する#認可コードを取得する)

<br>

### ローカルサーバを起動

```
npm run server
```

### トークンを取得する

[http://localhost:3000/](http://localhost:3000/)を開いてください。

未ログインの場合には、ログイン画面へのリンクが表示されます。画面の指示に従ってログイン情報を入力すると、トークンを取得することができます。

トークンは「src/server/oauth2/tokendata.json」に保存されます。


### API実行

トークン取得後、再度[http://localhost:3000/](http://localhost:3000/)を開くと、次の画面を表示することができます。

- 会社一覧
- 選択した会社の勘定科目一覧
- 選択した勘定科目の情報


また、下記URLから、JSON形式で取得したデータを表示することもできます。

#### 会社一覧
http://localhost:3000/api/companies

#### 会社詳細
http://localhost:3000/api/companies/（会社コード）

※（会社コード）の部分に数字7桁の会社コードを入力してください

#### 勘定科目詳細
http://localhost:3000/api/account_items/（会社コード）/（勘定科目コード）

※（会社コード）の部分に数字7桁の会社コード、（勘定科目コード）の部分に数字9桁の勘定科目コードを入力してください


### 単体で動くサンプル

./src/server/sample/sample.ts に、expressを使わない「単体で動くサンプル」を入れてあります。

トークン取得後に下記を実行すると、実行できます。

```
npm run tsnode ./src/server/sample/sample.ts
```