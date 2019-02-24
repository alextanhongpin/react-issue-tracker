import React, { useState, useContext, useEffect } from 'react'
import FirebaseContext from 'context/Firebase'

import { Form, Button } from 'semantic-ui-react'

function LogForm () {
  const [ text, setText ] = useState('')
  const { firebase } = useContext(FirebaseContext)

  const onChangeTextArea = (evt) =>
    setText(evt.currentTarget.value)

  const onClick = async (evt) => {
    try {
      const result = await firebase.database.ref('logs').push({
        createdAt: Date.now(),
        text
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
        <textarea value={text} placeholder='Enter what you have done here' onChange={onChangeTextArea} />
      </Form.Field>
      <Button onClick={onClick}>Submit</Button>
    </Form>
  )
}

function LogList () {
  const [logs, setLogs] = useState([])
  const { firebase } = useContext(FirebaseContext)

  const fetchLogs = async () => {
    const snapshot = await firebase.database.ref('/logs').once('value')
    const logs = snapshot.val()
    setLogs(Object.entries(logs))
  }

  useEffect(() => {
    fetchLogs()
  }, [])

  return (
    <div style={{ whiteSpace: 'pre-wrap' }}>
      {
        logs.map(([id, obj]) => (
          <div>
            <div>{obj.createdAt}</div>
            <div>{obj.text}</div>
          </div>
        ))
      }
    </div>
  )
}

function Home () {
  const { authUser } = useContext(FirebaseContext)
  return (
    <>

      {authUser && <div>is login</div>}
    Home
      <LogForm />
      <LogList />
    </>
  )
}

export default Home
