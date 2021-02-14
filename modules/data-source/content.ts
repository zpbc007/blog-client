import composeWithJson from 'graphql-compose-json'
import { schemaComposer, deepmerge } from 'graphql-compose'

/** 从 content 中获取本地 md 文件中的数据 */
export async function buildSchema(content: any) {
  // 所有文档
  const res: any[] = await content({ deep: true }).fetch()

  const mergedDoc = res.reduce<any>((acc, item) => {
    return deepmerge(acc, item)
  }, {})

  const ContentDocumentBodyTC = schemaComposer.createObjectTC({
    name: 'ContentDocument_Body',
    fields: {
      type: 'String',
      tag: 'String',
      value: 'String',
      children: ['ContentDocument_Body'],
      props: 'JSON',
    },
  })

  // 创建 schema
  const ContentDocumentTC = composeWithJson('ContentDocument', {
    ...mergedDoc,
    position: () => 'Int!',
    body: () => ContentDocumentBodyTC.getType(),
  })
  ContentDocumentTC.addResolver({
    name: 'contentDocs',
    type: [ContentDocumentTC],
    resolve: () => res,
  })

  schemaComposer.Query.addFields({
    contentDocs: ContentDocumentTC.getResolver('contentDocs'),
  })
}
