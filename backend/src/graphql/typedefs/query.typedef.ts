export const query = `#graphql
directive @auth(requires: [Role] = [USER, ADMIN]) on FIELD_DEFINITION

enum Role {
    ADMIN
    USER
}

type Query {
    rates: [Rate!]!
    users: [User!]! @auth(requires: [ADMIN])
    accounts: [Account!]! @auth
    transactions(query: QueryInput): [Transaction!]! @auth
}
`;
