export interface IDatabase<T> {
  persist(pk: string, entity: T): Promise<T>;
  find(pk: string): Promise<T | void>;
}
