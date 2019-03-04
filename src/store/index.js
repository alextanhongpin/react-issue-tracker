import React, { createContext, useContext, useReducer } from 'react'
import { createInitialState as logCreateInitialState, reducer as logReducer } from 'reducers/log'

export const StateContext = createContext()
export const DispatchContext = createContext()

export const StateProvider = ({ reducer, initialState, children }) => {
  const [state, dispatch] = useReducer(reducer, initialState)
  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>
        {children}
      </StateContext.Provider>
    </DispatchContext.Provider>
  )
}

export const useGlobalState = () => useContext(StateContext)
export const useDispatch = () => useContext(DispatchContext)

const createStore = () => ({
  state: {
    log: logCreateInitialState()
  },
  reducer ({ log }, action) {
    return {
      log: logReducer(log, action)
    }
  }
})

export default createStore
