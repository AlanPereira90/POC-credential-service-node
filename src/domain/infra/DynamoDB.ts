import AWS from 'aws-sdk';
import { AWS_CONFIG } from '../utils/environment';
import { IDyanamoDBConnection } from './interfaces/IDyanamoDBConnection';

let credentials = undefined;
if (AWS_CONFIG.ACCESS_KEY_ID && AWS_CONFIG.SECRET_ACCESS_KEY) {
  credentials = { accessKeyId: AWS_CONFIG.ACCESS_KEY_ID, secretAccessKey: AWS_CONFIG.SECRET_ACCESS_KEY };
}

const connection = new AWS.DynamoDB({
  endpoint: AWS_CONFIG.DYNAMO_ENDPOINT,
  region: AWS_CONFIG.DYNAMO_REGION,
  credentials,
});

export default connection as IDyanamoDBConnection;
