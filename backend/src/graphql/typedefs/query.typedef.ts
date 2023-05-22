export const query = `#graphql
type Query {
    rates: [Rate!]!
    users: [User!]!
    accounts: [Account!]!
    transactions(query: QueryInput): [Transaction!]!
}
`;
