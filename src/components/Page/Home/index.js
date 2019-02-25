import React, { useState, useContext, useEffect } from 'react'
import FirebaseContext from 'context/Firebase'
import { format, distanceInWordsToNow } from 'date-fns'
import { markdown } from 'markdown'
import DOMPurify from 'dompurify'

import './index.module.css'

import { Form, Button, TextArea } from 'semantic-ui-react'

function LogForm () {
  const [ text, setText ] = useState('')
  const { logsRef } = useContext(FirebaseContext)

  const onChangeTextArea = (evt) =>
    setText(evt.currentTarget.value)

  const onClick = async (evt) => {
    try {
      const result = await logsRef.push({
        createdAt: Date.now(),
        text,
        tags: '' // Cannot include array.
      })
      console.log(result)
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <Form>
      <Form.Field>
        <label>Description</label>
        <TextArea value={text} placeholder='Enter what you have done here' onChange={onChangeTextArea} autoHeight />
        <div className='markdown-body' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(markdown.toHTML(text)) }} />
      </Form.Field>
      <Button onClick={onClick}>Submit</Button>
    </Form>
  )
}

function LogList () {
  // TODO: Create a context for fetching/manipulating the data in log list.
  const [logs, setLogs] = useState([])
  const { logsRef } = useContext(FirebaseContext)

  const fetchLogs = async () => {
    // Firebase does not allow sorting by descending. Take the last 10 and
    // reverse the sorting manually.
    const snapshot = await logsRef
      .orderByChild('createdAt')
      .limitToLast(10)
      .once('value')
    const logs = snapshot.val()
    if (logs) setLogs(Object.entries(logs).reverse())
  }

  useEffect(() => {
    fetchLogs()
  }, [])
  return (
    <div style={{ whiteSpace: 'pre-wrap' }}>
      {
        logs.map(([id, obj]) => (
          <div>
            <div>{format(obj.createdAt, 'YYYY-MM-DD, HH:mm A')} ({distanceInWordsToNow(obj.createdAt)})</div>
            <div className='markdown-body' dangerouslySetInnerHTML={{
              __html: DOMPurify.sanitize(markdown.toHTML(obj.text))
            }} />
          </div>
        ))
      }
    </div>
  )
}

function Home () {
  const { firebase } = useContext(FirebaseContext)
  const onSignOut = () => firebase.auth.signOut()
  return (
    <>
      <Button onClick={onSignOut}>Sign Out</Button>
    Home
      <LogForm />
      <LogList />
    </>
  )
}

export default Home
