import faker from '@faker-js/faker';

process.env.NODE_ENV = 'test';
process.env.CIPHER_KEY = faker.datatype.string(100);
process.env.TOKEN_SECRET = faker.datatype.string(100);
process.env.AWS_DYNAMO_ENDPOINT = faker.internet.url();
process.env.AWS_DYNAMO_REGION = faker.lorem.word();
process.env.AWS_DYNAMO_TABLE_NAME = faker.lorem.word();
