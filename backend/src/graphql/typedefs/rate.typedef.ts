export const rate = `#graphql
type Rate {
    name: String!
    createdAt: String!
    conversion: Conversion!
}

type Conversion {
    usdFrom: Float!
    usdTo: Float!
}`;
