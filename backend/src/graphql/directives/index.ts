import { GraphQLSchema, defaultFieldResolver, GraphQLError } from 'graphql';
import { mapSchema, MapperKind, getDirectives } from '@graphql-tools/utils';
import { CustomError, UnauthorizedError } from '../../interfaces';

export function attachAuthDirective(schema: GraphQLSchema, directiveName: string): GraphQLSchema {
  return mapSchema(schema, {
    [MapperKind.OBJECT_FIELD]: fieldConfig => {
      const directives = getDirectives(schema, fieldConfig);
      const authDirective = directives.find(directive => directive.name === directiveName);
      if (authDirective) {
        const { args } = authDirective;
        if (args?.requires) {
          const roles = args.requires as string[];
          const { resolve = defaultFieldResolver } = fieldConfig;
          fieldConfig.resolve = function (source, args, context, info) {
            try {
              const userId = context.userId;
              const role: string = context.role;
              if (!userId || !roles.includes(role)) throw new UnauthorizedError('Not authorized');
              return resolve(source, args, context, info);
            } catch (error: any) {
              if (error instanceof CustomError)
                throw new GraphQLError(error.message, {
                  extensions: { code: error.errorType },
                });
              throw error;
            }
          };
          return fieldConfig;
        }
      }
    },
  });
}
