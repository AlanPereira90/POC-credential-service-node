import { inject, Lifecycle, registry, scoped } from 'tsyringe';

import { HttpVerb } from '../../../@types/http-verb';
import { ICredentialService } from '../../../domain/credential/interfaces/ICredentialService';
import { CustomRequest, CustomResponse, IController } from '../../interfaces/IController';

interface SignupRequest {
  userName: string;
  password: string;
}

interface SignupResponse {
  accessToken: string;
}

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Controller', useClass: SigninController }])
export default class SigninController implements IController {
  verb: HttpVerb = 'post';
  path: string = '/signin';

  constructor(@inject('CredentialService') private readonly _service: ICredentialService) {}

  public async handler(req: CustomRequest<SignupRequest>, res: CustomResponse<SignupResponse>) {
    const { userName, password } = req.body;
    const accessToken = await this._service.signin(userName, password);

    res.status(201).json({ accessToken });
  }
}
