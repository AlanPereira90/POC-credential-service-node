import faker from '@faker-js/faker';

process.env.NODE_ENV = 'test';
process.env.CIPHER_KEY = faker.datatype.string(100);
process.env.TOKEN_SECRET = faker.datatype.string(100);
