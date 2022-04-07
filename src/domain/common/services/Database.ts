import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';

import { IDatabase } from '../interfaces/IDatabase';
import { AWS_CONFIG } from '../../utils/environment';
import { IDyanamoDBConnection } from 'src/domain/infra/interfaces/IDyanamoDBConnection';
import { inject, Lifecycle, registry, scoped } from 'tsyringe';

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
            return reject(err);
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
            return reject(err);
          }

          if (data.Item) resolve(unmarshall(data.Item) as T);
        },
      );
    });
  }
}
