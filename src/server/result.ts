export type ErrorType = 'NOTOKEN' | 'REFRESHERROR';

export interface ResultError {
  readonly message: ErrorType;
}

export class Success<T> {
  public readonly isSuccess = true as const;
  public readonly isFailure = false as const;
  constructor(public readonly data: T) {}
}

export class Failure<E = ResultError> {
  public readonly isSuccess = false as const;
  public readonly isFailure = true as const;
  constructor(public readonly data: E) {}
}

export type Result<T, E = ResultError> = Success<T> | Failure<E>;
