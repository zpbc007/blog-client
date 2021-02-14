import { writeFile } from 'fs'
import { resolve } from 'path'
import { codegen } from '@graphql-codegen/core'
import { GraphQLSchema, printSchema, parse } from 'graphql'
import * as typescriptPlugin from '@graphql-codegen/typescript'

export function genType(schema: GraphQLSchema) {
  const filepath = resolve(__dirname, './schema.type.ts')
  return new Promise((resolve) => {
    //   @ts-ignore
    codegen({
      filename: filepath,
      plugins: [
        {
          typescript: {},
        },
      ],
      schema: parse(printSchema(schema)),
      pluginMap: {
        typescript: typescriptPlugin,
      },
    }).then((output) => {
      writeFile(filepath, output, resolve)
    })
  })
}
