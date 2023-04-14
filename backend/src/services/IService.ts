export interface IService<T> {
  create?(object: any): Promise<T>;
  getByID?(id: string): Promise<T>;
  getAll?(params?: any): Promise<T[]>;
  update?(id: string): Promise<T>;
  delete?(id: string): Promise<T>;
}
