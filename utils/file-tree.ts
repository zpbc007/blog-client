import { basename, join, sep } from 'path'
import { stat, Stats, readdir } from 'fs'
import { promisify } from 'util'
import consola from 'consola'

const asyncStat = promisify(stat)
const asyncReadDir = promisify(readdir)
const Logger = consola.withScope('file-tree')

export type FileType = 'file' | 'directory'

function getSubDirName(path: string) {
  return path.split(sep).find((item) => !!item)
}

class FileNode {
  // 子节点
  private child: FileNode[] = []
  // 子节点路径与 index 的映射关系
  private childPathIndexMap: { [key: string]: number } = {}
  // 只有文件节点才有意义
  index: number = -1

  // eslint-disable-next-line no-useless-constructor
  constructor(
    public name: string,
    public path: string,
    public type: FileType
  ) {}

  setChildren(child: FileNode[]) {
    this.childPathIndexMap = {}
    this.child = child
    this.child.forEach(({ path }, index) => {
      this.childPathIndexMap[basename(path)] = index
    })
  }

  // 通过文件绝对路径查找节点
  getChildByPath(path: string): null | FileNode {
    const pathInfo = `path: ${path}, nodePath: ${this.path}`
    // 路径不对
    if (!path.startsWith(this.path)) {
      Logger.warn(`path not match, ${pathInfo}`)
      return null
    }
    // 找到了
    if (this.path === path) {
      return this
    }

    // 子节点名称
    const childName = getSubDirName(path.replace(this.path, ''))
    if (!childName) {
      Logger.warn(`can not get childName, ${pathInfo}`)
      return null
    }

    const childIndex = this.childPathIndexMap[childName]
    if (childIndex !== undefined) {
      return this.child[childIndex].getChildByPath(path)
    }

    Logger.warn(`can not get childIndex, ${pathInfo}`)
    return null
  }

  getChild() {
    return this.child
  }
}

function walk(node: FileNode, operator: (node: FileNode) => void) {
  if (!node) {
    return null
  }

  operator(node)
  node.getChild().forEach((child) => walk(child, operator))
}

// 处理 windows 路径
function normalizePath(path: string) {
  return path.replace(/\\/g, '/')
}

async function safeAsync<T>(asyncFunc: () => Promise<T>, name: string) {
  try {
    const result = await asyncFunc()
    return result
  } catch (e) {
    Logger.error(`exec ${name} failed: `, e)
    return null
  }
}

export async function execBuild(
  rootPath: string,
  filter?: (path: string, stat: Stats) => boolean
) {
  const name = basename(rootPath)
  rootPath = normalizePath(rootPath)

  const stat = await safeAsync(() => asyncStat(rootPath), 'asyncStat')

  // 出错了
  if (stat === null) {
    return null
  }

  // 过滤
  if (filter) {
    const shouldIgnore = !filter(rootPath, stat)
    if (shouldIgnore) {
      return null
    }
  }

  if (stat.isFile()) {
    return new FileNode(name, rootPath, 'file')
  } else if (stat.isDirectory()) {
    const dirNode = new FileNode(name, rootPath, 'directory')
    const dirInfo = await safeAsync(
      () => asyncReadDir(rootPath),
      'asyncReadDir'
    )

    if (!dirInfo) {
      return dirNode
    }
    const children = await Promise.all(
      dirInfo.map((item) => execBuild(join(rootPath, item), filter))
    )
    dirNode.setChildren(
      // 过滤掉空节点
      (children.filter((item) => !!item) as FileNode[]).sort((a, b) => {
        // 文件在目录前
        if (a.type === b.type) {
          return 0
        }
        if (a.type === 'directory') return 1

        return -1
      })
    )

    return dirNode
  } else {
    Logger.warn(`not file or directory, path: ${rootPath}, stat: `, stat)
    return null
  }
}

export async function buildFileTree(
  rootPath: string,
  filter?: (path: string, stat: Stats) => boolean
) {
  const rootNode = await execBuild(rootPath, filter)
  if (rootNode) {
    let index = 0
    // 为每个文件节点设置 index，用于排序
    walk(rootNode, (node) => {
      if (node.type === 'file') {
        node.index = index++
      }
    })
  }

  return rootNode
}
