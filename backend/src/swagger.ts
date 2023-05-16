import swaggerJsdoc from 'swagger-jsdoc';

const options = {
  swaggerDefinition: {
    openapi: '3.0.3',
    info: {
      title: 'The Bank API by AM',
      version: '1.0.0',
    },
    tags: [
      {
        name: 'User',
        description: 'Endpoints',
      },
      {
        name: 'Transaction',
        description: 'Endpoints',
      },
      {
        name: 'Rates',
        description: 'Endpoints',
      },
    ],
    components: {
      schemas: {
        Account: {
          type: 'object',
          properties: {
            id: {
              type: 'number',
            },
            user_id: {
              type: 'string',
            },
            currency: {
              type: 'string',
            },
            balance: {
              type: 'number',
            },
          },
        },
        User: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            name: {
              type: 'string',
              nullable: 'true',
            },
            email: {
              type: 'string',
            },
          },
        },
        Transaction: {
          type: 'object',
          properties: {
            id: {
              type: 'string',
            },
            account_from_id: {
              type: 'number',
            },
            account_to_id: {
              type: 'number',
            },
            amount: {
              type: 'number',
            },
            created_at: {
              type: 'number',
            },
            description: {
              type: 'string',
              nullable: 'true',
            },
          },
        },
        Transfer: {
          type: 'object',
          properties: {
            account_from_id: {
              type: 'number',
              minimum: 1,
            },
            account_to_id: {
              type: 'number',
              minimum: 1,
            },
            amount: {
              type: 'number',
              minimum: 1,
            },
            description: {
              type: 'string',
              nullable: 'true',
            },
          },
        },
      },
    },
  },
  apis: ['./src/api/routes/*.routes.ts'],
};

export const openapiSpec = swaggerJsdoc(options);
