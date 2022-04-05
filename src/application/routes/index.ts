import { RequestHandler, Router } from 'express';

import ReadinessController from '../controllers/ReadinessController';
import { IController } from '../interfaces/IController';

const router: Router = Router();

function getControllers(): IController[] {
  return [new ReadinessController()];
}

function getHandler(controller: IController): RequestHandler[] {
  const handler: RequestHandler = async (req, res, next) => {
    await controller.handler(req, res, next);
  };

  return [handler];
}

for (const controller of getControllers()) {
  router[controller.verb](controller.path, getHandler(controller));
}

export default router;
