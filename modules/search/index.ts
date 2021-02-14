import type { Index, Builder } from 'lunr'

const lunr = require('lunr')
const { enhanceLunr } = require('./lang.js')

interface IDocument {
  id: string
  [key: string]: any
}

interface IFiled {
  name: string
  boost?: number
}

interface IGenSearchIndexConfig {
  languages: string[]
  docs: IDocument[]
  searchFields: IFiled[]
  storeFields: IFiled[]
}

/**
 * 构建索引以及文档需要保存的数据
 */
export function genSearchInfo({
  languages,
  docs,
  searchFields,
  storeFields,
}: IGenSearchIndexConfig) {
  enhanceLunr(lunr, languages)
  // 构建索引
  const langIndexMap = languages.reduce<{ [key: string]: Index }>(
    (acc, lang) => {
      const searchIndex = lunr(function (this: Builder) {
        // 添加对应语言
        if (lang !== 'en') {
          // @ts-ignore
          this.use(lunr[lang])
        }

        // 设置主键
        this.ref('id')

        // 设置查询字段
        searchFields.forEach(({ name, boost }) => {
          this.field(name, { boost })
        })

        // meta 白名单
        this.metadataWhitelist = ['position', 'index']

        // 需要保存的内容
        docs.forEach((doc) => {
          this.add(doc)
        })
      })

      return {
        ...acc,
        [lang]: searchIndex,
      }
    },
    {}
  )

  // 每个文档需要保存的数据
  const docIdDataMap = docs.reduce<{ [id: string]: any }>((acc, doc) => {
    return {
      ...acc,
      // 需要保存的字段
      [doc.id]: storeFields.reduce(
        (acc, field) => ({
          ...acc,
          [field.name]: doc[field.name],
        }),
        {}
      ),
    }
  }, {})

  return {
    langIndexMap,
    docIdDataMap,
  }
}
