import { ApolloServer } from 'apollo-server'
import { schemaComposer } from 'graphql-compose'
import { buildSchema as buildContentSchema } from './content'
import { buildSchema as buildApiSchema } from './api'
import { genType } from './gen-type'

export async function createApolloServer(content: any) {
  await Promise.all([buildContentSchema(content), buildApiSchema()])

  const schema = schemaComposer.buildSchema()

  // 生成 ts
  await genType(schema)

  return new ApolloServer({
    schema,
  })
}
