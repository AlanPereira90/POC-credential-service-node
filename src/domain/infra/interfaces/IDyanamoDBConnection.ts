import { DynamoDB } from 'aws-sdk';

export type IDyanamoDBConnection = Pick<DynamoDB, 'putItem' | 'getItem'>;
