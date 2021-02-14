import { Module } from '@nuxt/types'
import { genSearchInfo } from './search'

// 搜索功能
const FullTextSearch: Module = function () {
  // const { hook } = this.nuxt

  console.warn(
    'genSearchInfo ',
    genSearchInfo({
      languages: ['zh'],
      docs: [
        {
          id: '1',
          title: '你好',
          body: 'qewrqer',
        },
        {
          id: '2',
          title: '哈哈',
          body: 'zcvzcvzxvz',
        },
      ],
      searchFields: [{ name: 'title' }, { name: 'body' }],
      storeFields: [{ name: 'title' }, { name: 'body' }],
    })
  )
}

export default FullTextSearch
