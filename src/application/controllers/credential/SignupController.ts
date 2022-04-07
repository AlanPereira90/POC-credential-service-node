import Joi from 'joi';
import { inject, Lifecycle, registry, scoped } from 'tsyringe';
import { BAD_REQUEST, CREATED } from 'http-status';

import { HttpVerb } from '../../../@types/http-verb';
import {
  CustomNextFunction,
  CustomRequest,
  CustomResponse,
  CustomResponseError,
  IController,
} from '../../interfaces/IController';
import { ICredentialService } from '../../../domain/credential/interfaces/ICredentialService';

interface SignupRequest {
  userName: string;
  password: string;
}

interface SignupResponse {
  accessToken: string;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Controller', useClass: SignupController }])
export default class SignupController implements IController {
  verb: HttpVerb = 'post';
  path: string = '/signup';

  constructor(@inject('CredentialService') private readonly _service: ICredentialService) {}

  public async handler(req: CustomRequest<SignupRequest>, res: CustomResponse<SignupResponse>) {
    const { userName, password } = req.body;
    const accessToken = await this._service.signup(userName, password);

    res.status(CREATED).json({ accessToken });
  }

  public async requestValidator(req: CustomRequest<SignupRequest>, res: CustomResponseError, next: CustomNextFunction) {
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
