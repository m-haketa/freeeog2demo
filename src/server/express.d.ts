// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { freeeApi } from '@server/freee/api';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { TokenWithId } from '@server/oauth2/token';

declare global {
  namespace Express {
    interface Request {
      token: TokenWithId;
      api: ReturnType<typeof freeeApi>['api'];
    }
  }
}
