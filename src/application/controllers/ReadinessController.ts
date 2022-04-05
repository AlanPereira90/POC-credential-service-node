import { OK } from 'http-status';

import { HttpVerb } from '../../@types/http-verb';
import { CustomRequest, CustomResponse, IController } from '../interfaces/IController';

interface ReadinessResponse {
  status: boolean;
}

export default class ReadinessController implements IController {
  public verb: HttpVerb = 'get';
  public path = '/status';

  public handler(_req: CustomRequest<void>, res: CustomResponse<ReadinessResponse>): void {
    res.status(OK).send({
      status: true,
    });
  }
}
