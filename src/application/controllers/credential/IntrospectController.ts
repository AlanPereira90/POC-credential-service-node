import { inject, Lifecycle, registry, scoped } from 'tsyringe';

import { HttpVerb } from '../../../@types/http-verb';
import { CustomRequest, CustomResponse, IController } from '../../interfaces/IController';
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

    res.status(201).json({ credentialId: id });
  }
}
