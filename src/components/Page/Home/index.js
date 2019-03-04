import React, { useContext, useEffect } from 'react'

import CreateForm from 'components/Page/Home/CreateForm'
import List from 'components/Page/Home/List'
import FirebaseContext from 'context/Firebase'
import {
  LOGS_FETCHED,
  LOG_ADDED,
  LOG_CHANGED,
  LOG_DELETED
} from 'reducers/log'
import { useDispatch } from 'store'

import 'github-markdown-css'
import style from './index.module.css'

const Home = () => {
  const { logsRef } = useContext(FirebaseContext)
  const dispatch = useDispatch()

  const fetchLogs = async () => {
    const snapshot = await logsRef
      .orderByChild('createdAt')
      .limitToLast(20)
      .once('value')

    // Firebase does not allow sorting by descending.
    // Take the last 20 and perform manual sorting.
    const data = Object.entries(snapshot.val()).reverse()
    dispatch({
      type: LOGS_FETCHED,
      data
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
        type: LOG_ADDED,
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
        type: LOG_CHANGED,
        key,
        value
      })
    })
  }, [])

  useEffect(() => {
    return logsRef.on('child_removed', (snapshot) => {
      const key = snapshot.key
      dispatch({
        type: LOG_DELETED,
        key
      })
    })
  }, [])

  return (
    <div className={style.dividePage}>
      <List />
      <CreateForm />
    </div>
  )
}

export default Home
