export const mutation = `#graphql
type Mutation {
    createUser(user: UserCreateInput!): UserOutput!
    login(user: LoginInput!): UserWithToken!
    newTrasfer(transfer: TransactionInput!): Transaction!
}
`;
