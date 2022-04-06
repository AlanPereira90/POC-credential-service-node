import { marshall } from '@aws-sdk/util-dynamodb';
import { GetItemOutput } from 'aws-sdk/clients/dynamodb';

export default class DynamoDBObjectBuilder {
  public static buildGetItemResponse(data: Record<string, unknown>): GetItemOutput {
    return {
      Item: marshall(data),
    };
  }
}
