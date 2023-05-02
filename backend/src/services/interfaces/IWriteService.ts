export interface IWriteService<Output, CreateInput, UpdateInput> {
  create(object: CreateInput): Promise<Output>;
  update(object?: UpdateInput): Promise<Output>;
}
