import { inject, Lifecycle, registry, scoped } from 'tsyringe';

import { HttpVerb } from '../../../@types/http-verb';
import { CustomRequest, CustomResponse, IController } from '../../interfaces/IController';
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

    res.status(201).json({ accessToken });
  }
}
