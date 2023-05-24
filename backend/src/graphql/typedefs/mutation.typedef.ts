export const mutation = `#graphql
type Mutation {
    createUser(user: UserCreateInput!): UserOutput!
    login(user: UserLoginInput!): UserWithToken!
    transfer(transfer: TransactionInput!): Transaction! @auth
}
`;
