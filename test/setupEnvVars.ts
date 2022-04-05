import faker from '@faker-js/faker';

process.env.NODE_ENV = 'test';
process.env.TEMP = faker.lorem.word();
