export interface IRepository<T> {
  create(obj: any): Promise<any>;
  getByID?(id: string | number): Promise<T | undefined>;
  getAll(): Promise<T[]>;
  update?(id: string): Promise<T>;
  delete?(id: string): Promise<T>;
}
