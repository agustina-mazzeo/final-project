export interface IRepository<T> {
  create?(obj: any): Promise<T>;
  getByID?(id: string): Promise<T>;
  getAll(): Promise<T[]>;
  update?(id: string): Promise<T>;
  delete?(id: string): Promise<T>;
}
