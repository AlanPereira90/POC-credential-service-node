import * as statuses from 'http-status';

export default class ResponseError extends Error {
  status: number;
  code?: string;

  constructor(status = statuses.INTERNAL_SERVER_ERROR, message = statuses[status], code?: string) {
    super((message || 'Unknown error') as string);

    this.name = 'ResponseError';
    this.status = status;
    this.code = code;
  }
}
