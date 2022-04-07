import { NextFunction, Request, RequestHandler, Response } from 'express';
import { HttpVerb } from '../../@types/http-verb';

export type ParametersField = 'query' | 'params' | 'body';

export type CustomRequest<R, T extends ParametersField = 'body'> = T extends 'query'
  ? Request<unknown, unknown, unknown, R>
  : T extends 'body'
  ? Request<unknown, unknown, R>
  : T extends 'params'
  ? Request<R>
  : never;

export type CustomResponse<T> = Response<T>;

export type CustomResponseError = CustomResponse<{ message: string }>;

export type CustomNextFunction = NextFunction;

export type CustomRequestHandler = RequestHandler;

export interface IController {
  verb: HttpVerb;
  path: string;
  handler: CustomRequestHandler;
  requestValidator?: CustomRequestHandler;
}
