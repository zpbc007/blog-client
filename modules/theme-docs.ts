import { exec } from 'child_process'
import { isAbsolute, resolve, join, basename } from 'path'
import { access } from 'fs'
import defu from 'defu'
import { Module } from '@nuxt/types'
import chalk from 'chalk'
import consola from 'consola'
import { buildFileTree } from '../utils/file-tree'
import tailwindConfig from './tailwind.config'
import { createApolloServer } from './data-source'

const Logger = consola.withScope('theme-docs')

interface IThemeDocsConfig {
  // 文档所在仓库地址
  docRepoUrl: string
  // clone 后的地址
  docRepoDir: string
}

const ThemeDocs: Module = async function () {
  const { nuxt } = this
  const { options, hook } = this.nuxt

  const { docRepoUrl, docRepoDir }: IThemeDocsConfig = options.themeDocs || {}
  const contentRoot = options.content.dir

  if (!docRepoUrl) {
    return Logger.error('docRepoUrl should not be empty!')
  }

  if (!docRepoDir) {
    return Logger.error('docRepoDir should not be empty')
  }

  let targetDir = docRepoDir

  if (!isAbsolute(targetDir)) {
    targetDir = resolve(options.srcDir, targetDir)
  }

  // 检查是否已经克隆过
  const hasCloned = await dirExist(targetDir)

  // clone
  if (!hasCloned) {
    const error = await safeExec(`git clone ${docRepoUrl} ${targetDir}`)
    if (error) {
      return Logger.error(`clone git repo: ${docRepoUrl} failed: `, error)
    }
  }

  // 更新
  const error = await safeExec(
    `cd ${targetDir} && git fetch && git clean -fd && git checkout -f nuxt && git pull --ff-only`
  )
  if (error) {
    return Logger.error(`update git repo: ${targetDir} failed: `, error)
  }

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

  const dirRootNode = await buildFileTree(
    contentRoot,
    (nodePath) => !basename(nodePath).startsWith('.')
  )
  if (!dirRootNode) {
    Logger.error(`dirRootNode should not empty, contentRoot: ${contentRoot}`)
  }
  hook('content:file:beforeInsert', (document: any) => {
    const { dir, slug, category, path, extension } = document
    const absolutePath = join(contentRoot, `${path}${extension}`)
    // 配置文档连接
    document.to = dir === '/' ? `/${slug}` : `${dir}/${slug}`
    document.category = category
    if (dirRootNode) {
      const fileNode = dirRootNode.getChildByPath(absolutePath)
      if (fileNode) {
        document.position = fileNode.index
      } else {
        Logger.warn(`can not find fileNode by path: ${absolutePath}`)
      }
    }
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

function dirExist(path: string) {
  return new Promise<boolean>((resolve) => {
    access(path, (error) => {
      resolve(!error)
    })
  })
}

function safeExec(command: string) {
  return new Promise((resolve) => {
    exec(command, (error) => {
      resolve(error)
    })
  })
}
