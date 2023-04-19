export interface IService<T> {
  create(id: number, object: any): Promise<T>;
  getByID?(id: string): Promise<T>;
  getAll(id?: number | string, params?: any): Promise<T[]>;
  update?(id: string): Promise<T>;
  delete?(id: string): Promise<T>;
}
