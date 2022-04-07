import 'reflect-metadata';
import chai from 'chai';
import sinonChai from 'sinon-chai';
import chaiAsPromised from 'chai-as-promised';

import '../src/domain/config/di';
import '../src/application/config/di';

import './setupEnvVars';

chai.use(sinonChai);
chai.use(chaiAsPromised);
