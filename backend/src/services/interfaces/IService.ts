export interface IService<T> {
  create(object: any, id?: number | string): Promise<T>;
  getByID(id?: string | number): Promise<T>;
  getAll(params?: any, id?: number | string): Promise<T[]>;
  update(obj?: any): Promise<T>;
}
