export interface IWriteService<Output, CreateInput, UpdateInput, PrismaContext> {
  create(object: CreateInput): Promise<Output>;
  update(object?: UpdateInput, prisma?: PrismaContext): Promise<Output>;
}
