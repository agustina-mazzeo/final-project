export const transaction = `#graphql
type Transaction {
    id: ID!
    accountFromId: Int!
    accountToId: Int!
    amount: Int!
    createdAt: String!
    description: String
}

input QueryParamsInput {
    accountFrom: Int
    from: String
    to: String
}

input TransactionInput {
    accountFrom: Int!
    accountTo: Int!
    amount: Int!
    description: String
}
`;
