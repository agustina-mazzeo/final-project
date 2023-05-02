export interface IReadService<Output, GetAllInput, GetByIDInput> {
  getAll(object?: GetAllInput): Promise<Output[]>;
  getByID(id?: GetByIDInput): Promise<Output>;
}
