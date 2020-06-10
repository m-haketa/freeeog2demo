import { Express, RequestHandler } from 'express';
import aspida from '@aspida/node-fetch';
import fetch, {
  RequestInfo,
  RequestInit,
  Response as FetchResponse,
} from 'node-fetch';

import api from '@server/aspida/$api';
import { token } from '@server/oauth2/token';
import { urls } from '../const';

import { asyncWrap } from '@server/utils';
import { ApiError } from '@server/serverclientapi/errorMessage';

interface ErrorData {
  type: string;
  messages: string[];
}

interface ErrorBody {
  status_code: number;
  errors: ErrorData[];
  //message?: string;
}

const fetchErrorHandled = (
  url: RequestInfo,
  init?: RequestInit
): Promise<FetchResponse> => {
  const fetchRet = fetch(url, init).then((res) => {
    //jsonで値を取得した結果をいったん格納
    const jsonPromise = res.json();

    //Responseのjson取得ロジックを上書き
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    res.json = async (): Promise<any> => {
      const json = await jsonPromise;

      if ('message' in json) {
        console.log(JSON.stringify(json));
        //messageプロパティがあるときはエラー
        if (json.message === 'ログインをして下さい') {
          //TOKEN誤りなど
          throw new ApiError('NOLOGIN');
        } else if (json.message === 'アクセスする権限がありません') {
          //TOKEN期限切れなど
          throw new ApiError('NOAUTH');
        } else {
          //その他（どういうものがあるか不明）
          throw new ApiError('SYSTEM ERROR');
        }
      } else if ('errors' in json) {
        //errorsプロパティがあるときはエラー
        //companyでid指定がおかしい場合など
        const messages = (json as ErrorBody).errors
          .map((error) => error.messages)
          .join(',');
        throw new Error(messages);
      }
      return json;
    };

    //jsonメソッド書き換え後のResponse（Promise）を返す
    return res;
  });

  //jsonメソッド書き換え後のResponse（Promise）を返す
  return fetchRet;
};

// eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
export const freeeApi = (accessToken: string) => {
  return api(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    aspida(fetchErrorHandled as any, {
      baseURL: urls.baseURL,
      headers: {
        'Content-Type': 'application/json',
        Authorization: 'Bearer ' + accessToken,
      },
    })
  );
};

const addTokenApi: RequestHandler = asyncWrap(async (req, res, next) => {
  const tokenContainer = await token.get();
  if (tokenContainer.isSuccess) {
    req.token = tokenContainer.data;
    req.api = freeeApi(tokenContainer.data.access_token).api;
  }
  //isSuccessでない場合には、req.token、req.apiはundefinedのまま
  next();
});

export const freeeApiInit = (app: Express): void => {
  app.use(addTokenApi);
};
