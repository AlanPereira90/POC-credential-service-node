import Joi from 'joi';
import { inject, Lifecycle, registry, scoped } from 'tsyringe';
import { BAD_REQUEST, OK } from 'http-status';

import { HttpVerb } from '../../../@types/http-verb';
import { ICredentialService } from '../../../domain/credential/interfaces/ICredentialService';
import {
  CustomNextFunction,
  CustomRequest,
  CustomResponse,
  CustomResponseError,
  IController,
} from '../../interfaces/IController';

interface SigninRequest {
  userName: string;
  password: string;
}

interface SigninResponse {
  accessToken: string;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Controller', useClass: SigninController }])
export default class SigninController implements IController {
  verb: HttpVerb = 'post';
  path: string = '/signin';

  constructor(@inject('CredentialService') private readonly _service: ICredentialService) {}

  public async handler(req: CustomRequest<SigninRequest>, res: CustomResponse<SigninResponse>) {
    const { userName, password } = req.body;
    const accessToken = await this._service.signin(userName, password);

    res.status(OK).json({ accessToken });
  }

  public async requestValidator(req: CustomRequest<SigninRequest>, res: CustomResponseError, next: CustomNextFunction) {
    const schema = Joi.object({
      userName: Joi.string().required(),
      password: Joi.string().required(),
    });

    const { error } = schema.validate(req.body);

    if (error) {
      res.status(BAD_REQUEST).json({ message: error.message });
    } else {
      next();
    }
  }
}
