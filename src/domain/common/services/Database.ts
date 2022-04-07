import { inject, Lifecycle, registry, scoped } from 'tsyringe';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { INTERNAL_SERVER_ERROR } from 'http-status';

import { IDatabase } from '../interfaces/IDatabase';
import { AWS_CONFIG } from '../../utils/environment';
import { IDyanamoDBConnection } from '../../infra/interfaces/IDyanamoDBConnection';
import ResponseError from '../../utils/ResponseError';

@scoped(Lifecycle.ResolutionScoped)
@registry([{ token: 'Database', useClass: Database }])
export default class Database<T> implements IDatabase<T> {
  constructor(@inject('DynamoDBConnection') private readonly _connection: IDyanamoDBConnection) {}

  async persist(pk: string, entity: T): Promise<T> {
    return new Promise((resolve, reject) => {
      const item = {
        PK: pk,
        ...entity,
      };

      this._connection.putItem(
        {
          TableName: AWS_CONFIG.DYNAMO_TABLE_NAME,
          Item: marshall(item),
        },
        (err) => {
          if (err) {
            return reject(new ResponseError(INTERNAL_SERVER_ERROR, err.message, err.code));
          }
          resolve(entity);
        },
      );
    });
  }

  find(pk: string): Promise<void | T> {
    return new Promise((resolve, reject) => {
      this._connection.getItem(
        {
          TableName: AWS_CONFIG.DYNAMO_TABLE_NAME,
          Key: marshall({
            PK: pk,
          }),
        },
        (err, data) => {
          if (err) {
            return reject(new ResponseError(INTERNAL_SERVER_ERROR, err.message, err.code));
          }

          resolve(data.Item ? (unmarshall(data.Item) as T) : undefined);
        },
      );
    });
  }
}
