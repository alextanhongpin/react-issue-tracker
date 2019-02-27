import React, { useEffect, useContext, useReducer } from 'react'
import FirebaseContext from 'context/Firebase'

const PageContext = React.createContext(null)

const initialState = {
  logs: new Map()
}

const reducer = (state, action) => {
  switch (action.type) {
    case 'SET_LOGS':
      return { ...state, logs: action.data }
    case 'LOG_ADDED':
    case 'LOG_CHANGED':
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
    case 'LOG_DELETED':
      state.logs.delete(action.key)
      // Need to return the new state.
      return { ...state, logs: state.logs }
    default:
      return state
  }
}

export const PageContextProvider = ({ children }) => {
  const { logsRef } = useContext(FirebaseContext)
  const [state, dispatch] = useReducer(reducer, initialState)
  const value = { state, dispatch }

  const fetchLogs = async () => {
    const snapshot = await logsRef
      .orderByChild('createdAt')
      .limitToLast(20)
      .once('value')
    // Firebase does not allow sorting by descending.
    // Take the last 20 and perform manual sorting.
    const data = Object.entries(snapshot.val()).reverse()
    dispatch({
      type: 'SET_LOGS',
      data: new Map(data)
    })
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  useEffect(() => {
    return logsRef.on('child_added', (snapshot) => {
      const key = snapshot.key
      const value = snapshot.val()
      dispatch({
        type: 'LOG_ADDED',
        key,
        value
      })
    })
  }, [])

  useEffect(() => {
    return logsRef.on('child_changed', (snapshot) => {
      const key = snapshot.key
      const value = snapshot.val()
      dispatch({
        type: 'LOG_CHANGED',
        key,
        value
      })
    })
  }, [])

  useEffect(() => {
    return logsRef.on('child_removed', (snapshot) => {
      const key = snapshot.key
      console.log('child remoe', key)
      dispatch({
        type: 'LOG_DELETED',
        key
      })
    })
  }, [])

  return (
    <PageContext.Provider value={value}>
      {children}
    </PageContext.Provider>
  )
}

export default PageContext
