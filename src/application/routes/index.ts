import { RequestHandler, Router } from 'express';
import { container } from 'tsyringe';

import { IController } from '../interfaces/IController';

const router: Router = Router();

function getControllers(): IController[] {
  return container.resolveAll<IController>('Controller');
}

function getHandler(controller: IController): RequestHandler[] {
  const handler: RequestHandler = async (req, res, next) => {
    try {
      await controller.handler(req, res, next);
    } catch (err) {
      next(err);
    }
  };

  const requestValidator: RequestHandler = async (req, res, next) => {
    if (controller.requestValidator) {
      await controller.requestValidator(req, res, next);
    } else {
      next();
    }
  };

  return [requestValidator, handler];
}

for (const controller of getControllers()) {
  console.info(`Route ${controller.verb.toUpperCase()} ${controller.path} enabled`);
  router[controller.verb](controller.path, getHandler(controller));
}

export default router;
