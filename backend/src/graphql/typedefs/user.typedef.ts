export const user = `#graphql
type User {
    id: ID!
    name: String
    email: String!
    password: String!
}

input UserCreateInput {
    name: String
    email: String!
    password: String!
}

type UserOutput {
    email: String!
    name: String
}

input UserLoginInput {
    email: String!
    password: String!
}

type UserWithToken {
    user: UserOutput!
    token: Token!
}

type Token {
    token: String!
    expiresIn: String!
}`;
