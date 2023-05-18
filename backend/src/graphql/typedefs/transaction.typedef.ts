export const transaction = `#graphql
type Transaction {
    id: ID!
    accountFromId: Int!
    accountToId: Int!
    amount: Float!
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
    amount: Float!
    description: String
}
`;
