export interface IWriteRepository<Model, CreateInput, UpdateInput> {
  create(obj: CreateInput): Promise<Model>;
  update(obj?: UpdateInput): Promise<Model>;
  delete?(id: string): Promise<Model>;
}
