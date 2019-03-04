export const initialState = {
  logs: new Map()
}

export const createInitialState = () => ({ ...initialState })

export const LOGS_FETCHED = 'LOGS_FETCHED'
export const LOG_ADDED = 'LOG_ADDED'
export const LOG_CHANGED = 'LOG_CHANGED'
export const LOG_DELETED = 'LOG_DELETED'

export const reducer = (state, action) => {
  switch (action.type) {
    case LOGS_FETCHED:
      return { ...state, logs: new Map(action.data) }
    case LOG_ADDED:
    case LOG_CHANGED:
      const logs = state.logs.set(action.key, action.value)
      const sortedLogs = Array.from(logs).sort((a, b) => {
        const [l, r] = [a, b].map(([, { createdAt }]) => createdAt)
        if (l > r) {
          return -1
        }
        if (l < r) {
          return 1
        }
        return 0
      })
      return { ...state, logs: new Map(sortedLogs) }
    case LOG_DELETED:
      state.logs.delete(action.key)
      // Need to return the new state.
      return { ...state, logs: state.logs }
    default:
      return state
  }
}
