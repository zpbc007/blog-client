import defu from 'defu'
import { Module } from '@nuxt/types'
import chalk from 'chalk'
import tailwindConfig from './tailwind.config'
import { createApolloServer } from './data-source'

const ThemeDocs: Module = function () {
  const { nuxt } = this
  const { options, hook } = this.nuxt

  // 创建 tailwind config
  hook('tailwindcss:config', (defaultTailwindConfig: any) => {
    Object.assign(
      defaultTailwindConfig,
      defu(defaultTailwindConfig, tailwindConfig({ nuxt }))
    )
  })

  // dev 时可以编辑
  if (options.dev) {
    options.css.push('~/assets/css/main.dev.css')
  }

  hook('content:file:beforeInsert', (document: any) => {
    const { dir, slug, category } = document

    // 配置文档连接
    document.to = dir === '/' ? `/${slug}` : `${dir}/${slug}`
    document.category = category
  })

  // 渲染首页找到其他的所有页面
  hook('build:extendRoutes', (routes: any) => {
    const allRoute = routes.find((route: any) => route.name === 'all')

    routes.push({
      ...allRoute,
      path: '/',
      name: 'index',
    })
  })

  // 创建 graphql layer
  hook('content:ready', async (content: any) => {
    const server = await createApolloServer(content)
    server.listen().then((serverInfo) => {
      nuxt.options.cli.badgeMessages.push(
        chalk.bold.blueBright('Yoda Docs'),
        ''
      )
      nuxt.options.cli.badgeMessages.push(
        `${chalk.bold('Graphql Playground:')} ${chalk.underline.yellow(
          serverInfo.url
        )}`
      )
    })
  })
}

export default ThemeDocs
