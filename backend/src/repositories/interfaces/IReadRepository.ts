export interface IReadRepository<Model, GetAllInput, GetByIDInput> {
  getByID(id: GetByIDInput): Promise<Model | undefined>;
  getAll(filter?: GetAllInput): Promise<Model[]>;
}
