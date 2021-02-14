import { Machine } from 'xstate'

interface AppSearchStateSchema {
  states: {
    // 未激活
    unActive: {}
    // 激活
    active: {
      states: {
        // 初始
        initial: {}
        // 加载中
        loading: {}
        // 未找到
        notFound: {}
        // 找到了
        found: {}
      }
    }
  }
}

type AppSearchEvent =
  | { type: 'FOCUS' }
  | { type: 'BLUR' }
  | { type: 'SEARCH' }
  | { type: 'FOUND' }
  | { type: 'NOTFOUND' }

export function getAppSearchStateMachine() {
  return Machine<void, AppSearchStateSchema, AppSearchEvent>({
    id: 'appSearch',
    initial: 'unActive',
    states: {
      unActive: {
        on: {
          FOCUS: 'active',
        },
      },
      active: {
        on: {
          BLUR: 'unActive',
        },
        initial: 'initial',
        states: {
          initial: {
            on: {
              SEARCH: 'loading',
            },
          },
          loading: {
            on: {
              SEARCH: 'loading',
              FOUND: 'found',
              NOTFOUND: 'notFound',
            },
          },
          notFound: {
            on: {
              SEARCH: 'loading',
            },
          },
          found: {
            on: {
              SEARCH: 'loading',
            },
          },
        },
      },
    },
  })
}
