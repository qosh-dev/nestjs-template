export enum SystemHeaders {
  xRequestId = 'x-request-id',
  employeeId = 'x-employee-id',
  tz = 'tz'
}

export interface IRequestContext {
  [SystemHeaders.xRequestId]: string;
  [SystemHeaders.employeeId]: string;
  [SystemHeaders.tz]: string;
}
