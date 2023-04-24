export interface IRepository<T> {
  create(obj: any): Promise<any>;
  getByID?(id: string | number): Promise<T | undefined>;
  getAll(filter?: { filterBy: keyof T; value: any }[]): Promise<T[]>;
  update?(obj: any): Promise<T>;
  delete?(id: string): Promise<T>;
}
