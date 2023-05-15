export interface IReadRepository<Model, GetAllInput, GetByIDInput> {
  getByID(id: GetByIDInput): Promise<Model | null>;
  getAll(filter?: GetAllInput): Promise<Model[]>;
}
