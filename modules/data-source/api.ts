import { deepmerge, schemaComposer } from 'graphql-compose'
import composeWithJson from 'graphql-compose-json'

const MockData = [
  {
    id: 1,
    bridgeName: 'getDeviceInfo',
    nameSpace: 'system',
    intro: '获取设备信息',
    contacts: {
      fe: 'zhangsan',
      android: 'lisi',
      wangwu: 'wangwu',
    },
    supportVersion: {
      android: '8.1.30.2980',
      ios: '8.1.30.2980',
    },
    tags: ['设备信息', 'uuid'],
    md: `
        ## 用于获取设备信息的桥

        ${'```'}ts
        yoda.system.getDeviceInfo({}, res => {
          console.log(res)
        })
        ${'```'}
    `,
  },
  {
    id: 2,
    bridgeName: 'getDeviceInfo',
    nameSpace: 'system',
    intro: '获取设备信息',
    contacts: {
      fe: 'zhangsan',
      android: 'lisi',
      wangwu: 'wangwu',
    },
    supportVersion: {
      android: '8.1.30.2980',
      ios: '8.1.30.2980',
    },
    tags: ['设备信息', 'uuid'],
    md: `
        ## 用于获取设备信息的桥

        ${'```'}ts
        yoda.system.getDeviceInfo({}, res => {
          console.log(res)
        })
        ${'```'}
    `,
  },
]

function getApiData() {
  return new Promise<typeof MockData>((resolve) => {
    setTimeout(() => resolve(MockData), 1000)
  })
}

/** 从服务端获取文档相关数据 */
export async function buildSchema() {
  const apiData = await getApiData()

  const mergedApiData = apiData.reduce((acc, item) => {
    return deepmerge(acc, item)
  }, {} as any)

  const YodaBridgeDocTC = composeWithJson('YodaBridgeDocs', {
    ...mergedApiData,
    id: 'Int',
  })

  YodaBridgeDocTC.addResolver({
    name: 'yodaBridgeDocs',
    type: [YodaBridgeDocTC],
    resolve: () => apiData,
  })

  schemaComposer.Query.addFields({
    yodaBridgeDocs: YodaBridgeDocTC.getResolver('yodaBridgeDocs'),
  })
}
