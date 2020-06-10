export const ApiErrorMessageValues = [
  'NOLOGIN',
  'NOAUTH',
  'SYSTEM ERROR',
] as const;

export type ApiErrorMessageType = typeof ApiErrorMessageValues[number];

export class ApiError extends Error {
  constructor(message: ApiErrorMessageType) {
    super(message);
  }
}
