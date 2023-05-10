export interface IWriteRepository<Model, CreateInput, UpdateInput, PrismaContext> {
  create(obj: CreateInput, prisma?: PrismaContext): Promise<Model>;
  update(obj?: UpdateInput, prisma?: PrismaContext): Promise<Model>;
  delete?(id: string, prisma?: PrismaContext): Promise<Model>;
}
