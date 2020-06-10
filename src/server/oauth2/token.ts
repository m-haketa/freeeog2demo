import fs from 'fs';
import path from 'path';
import { Mutex } from 'await-semaphore';

import { refreshToken } from './refresh';
import { Failure, Result, Success } from '@server/result';

const SecondsBeforeExpirationToRenew = 3600;

//tokenを格納するファイル名、ファイルパス
const tokenFilename = 'tokendata.json';
const tokenFilepath = path.join(__dirname, tokenFilename);

export interface Token {
  access_token: string;
  token_type: 'bearer';
  expires_in: number;
  refresh_token: string;
  scope: string;
  created_at: number;
}

export interface TokenId {
  id: string; //session使用時のidにするため。元々のtokenには含まれていない
}

export interface TokenWithId extends Token, TokenId {}

class TokenData {
  private filepath: string;
  private token: TokenWithId | undefined;
  private mutex = new Mutex();

  constructor(filepath: string) {
    this.filepath = filepath;
  }

  private createId(): string {
    ///暫定
    return 'abc';
  }

  async get(forceRefresh = false): Promise<Result<TokenWithId>> {
    //排他制御をするため（＋他から呼び出されないように）実装部分を別途関数として定義
    const getImpl = async (
      forceRefresh = false
    ): Promise<Result<TokenWithId>> => {
      if (this.token === undefined) {
        try {
          const token: TokenWithId = JSON.parse(
            fs.readFileSync(this.filepath, 'utf-8')
          );
          this.token = token;
        } catch (e) {
          return new Failure({ message: 'NOTOKEN' });
        }
      }

      try {
        if (forceRefresh || this.needToRefresh(this.token)) {
          await this.refreshImpl(this.token);
        }
      } catch (e) {
        return new Failure({ message: 'REFRESHERROR' });
      }

      return new Success(this.token);
    };

    //排他制御のうえ呼び出し
    const release = await this.mutex.acquire();
    const ret = getImpl(forceRefresh);

    release();
    return ret;
  }

  set(token: Token): void {
    //idは暫定。実際にはランダムで振る
    const tokenWithId: TokenWithId = { id: this.createId(), ...token };

    try {
      fs.writeFileSync(this.filepath, JSON.stringify(tokenWithId));
      this.token = tokenWithId;
    } catch (e) {
      throw new Error('error:set token');
    }
  }

  clear(): void {
    try {
      fs.unlinkSync(this.filepath);
      this.token = undefined;
    } catch (e) {
      throw new Error('error:clear token');
    }
    return;
  }

  async refresh(): Promise<void> {
    await this.get(true);
  }

  private async refreshImpl(token: TokenWithId): Promise<void> {
    const retToken = await refreshToken(token.refresh_token).catch(() => {
      throw new Error('error:refresh token - refresh error');
    });

    this.set(retToken);
  }

  private needToRefresh(tokenData: TokenWithId): boolean {
    return (
      tokenData.expires_in +
        tokenData.created_at -
        SecondsBeforeExpirationToRenew <=
      Math.floor(new Date().getTime() / 1000)
    );
  }
}

export const token = new TokenData(tokenFilepath);
