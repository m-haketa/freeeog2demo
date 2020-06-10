import { RequestHandler, Request, Response, NextFunction } from 'express';

export interface PromiseRequestHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  (req: Request, res: Response, next: NextFunction): Promise<any>;
}

export function asyncWrap(fn: PromiseRequestHandler): RequestHandler {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (req, res, next): any => fn(req, res, next).catch(next);
}
