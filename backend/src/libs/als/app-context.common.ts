export enum SystemHeaders {
  xRequestId = 'x-request-id',
  userId = 'x-user-id',
  tz = 'tz'
}

export interface IRequestContext {
  [SystemHeaders.xRequestId]: string;
  [SystemHeaders.userId]: string;
  [SystemHeaders.tz]: string;
}
