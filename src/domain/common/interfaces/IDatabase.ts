export interface IDatabase<T> {
  persist(entity: T): Promise<T>;
  find(pk: string): Promise<T | void>;
  delete(pk: string): Promise<void>;
}
