import Joi from 'joi';
import { inject, Lifecycle, registry, scoped } from 'tsyringe';
import { BAD_REQUEST, OK } from 'http-status';

import { HttpVerb } from '../../../@types/http-verb';
import {
  CustomNextFunction,
  CustomRequest,
  CustomResponse,
  CustomResponseError,
  IController,
} from '../../interfaces/IController';
import { IToken } from '../../../domain/common/interfaces/IToken';

interface IntrospectRequest {
  accessToken: string;
}

interface IntrospectResponse {
  credentialId: string;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Controller', useClass: IntrospectController }])
export default class IntrospectController implements IController {
  verb: HttpVerb = 'post';
  path: string = '/introspect';

  constructor(@inject('Token') private readonly _service: IToken) {}

  public async handler(req: CustomRequest<IntrospectRequest>, res: CustomResponse<IntrospectResponse>) {
    const { accessToken } = req.body;
    const {
      data: { id },
    } = await this._service.verify(accessToken);

    res.status(OK).json({ credentialId: id });
  }

  public async requestValidator(
    req: CustomRequest<IntrospectRequest>,
    res: CustomResponseError,
    next: CustomNextFunction,
  ) {
    const schema = Joi.object({
      accessToken: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      res.status(BAD_REQUEST).json({ message: error.message });
    } else {
      next();
    }
  }
}
