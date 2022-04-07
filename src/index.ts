import 'reflect-metadata';

import './domain/config/di';
import './application/config/di';

import { App } from './application/setup/App';

const app = new App();
app.listen();
