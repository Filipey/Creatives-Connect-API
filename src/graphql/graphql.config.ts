import { Neo4jGraphQL } from '@neo4j/graphql';
import { auth, driver as neo4jDriver } from 'neo4j-driver';
import { typeDefs } from 'src/database/database.schema';

export const gqlProviderFactory = async () => {
  const { DATABASE_URL_CONNECTION, DATABASE_USERNAME, DATABASE_PASSWORD } =
    process.env;

  const driver = neo4jDriver(
    DATABASE_URL_CONNECTION,
    auth.basic(DATABASE_USERNAME, DATABASE_PASSWORD),
  );

  const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

  const schema = await neoSchema.getSchema();
  await neoSchema.assertIndexesAndConstraints({ options: { create: true } });

  return {
    playground: true,
    schema,
  };
};
