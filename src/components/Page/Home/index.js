import React, { useState, useContext } from 'react'
import FirebaseContext from 'context/Firebase'
import { format, distanceInWordsToNow } from 'date-fns'
import { markdown } from 'markdown'
import DOMPurify from 'dompurify'
import PageContext, { PageContextProvider } from 'components/Page/Home/context'

import './index.module.css'

import { Icon, Item, Divider, Form, Button, TextArea } from 'semantic-ui-react'

function LogForm () {
  const [ text, setText ] = useState('')
  const [ tags, setTag ] = useState('')
  const { logsRef } = useContext(FirebaseContext)

  const onChangeTextArea = (evt) =>
    setText(evt.currentTarget.value)

  const onChange = (evt) =>
    setTag(evt.currentTarget.value)

  const onClick = async (evt) => {
    try {
      const now = Date.now()
      await logsRef.push({
        createdAt: now,
        updatedAt: now,
        text: text.trim(),
        tags // Cannot include array.
      })
      // Reset.
      setText('')
      setTag('')
    } catch (error) {
      console.log('error', error)
    }
  }

  return (
    <Form>
      <Form.Field>
        <label>Description</label>
        <TextArea value={text} placeholder='Enter what you have done here' onChange={onChangeTextArea} autoHeight required />
        <input type='text' name='tags' value={tags} onChange={onChange} placeholder='Enter tags separated by commas' />
        <div className='markdown-body' dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(markdown.toHTML(text)) }} />
      </Form.Field>
      <Button onClick={onClick}>Submit</Button>
    </Form>
  )
}

function EditForm ({ text: prevText, onSubmit, onCancel }) {
  const [ text, setText ] = useState(prevText)

  const onChangeTextArea = (evt) =>
    setText(evt.currentTarget.value)

  return (
    <Form>
      <Form.Field>
        <label>Description</label>
        <TextArea value={text} placeholder='Enter what you have done here' onChange={onChangeTextArea} autoHeight />
      </Form.Field>
      <Button onClick={(evt) => onSubmit(evt, text)} positive>Submit</Button>
      <Button onClick={onCancel}>Cancel</Button>
    </Form>
  )
}

function LogList ({ authUser }) {
  const [editable, setEditable] = useState(false)
  const { state } = useContext(PageContext)

  const logs = Array.from(state.logs)
  const { logsRef } = useContext(FirebaseContext)
  const updateText = async ({ id, text }) => {
    try {
      await logsRef.child(id).update({
        text,
        updatedAt: Date.now()
      })
      setEditable(null)
    } catch (error) {
      console.log('error updating:', error)
    }
  }
  const onRemove = async(id) => await logsRef.child(id).remove()

  return (
    <Item.Group style={{ whiteSpace: 'pre-wrap' }}>
      {
        logs.map(([id, obj]) => (
          <React.Fragment key={id}>
            <Divider horizontal>
              {distanceInWordsToNow(obj.createdAt)}
            </Divider>
            <Item>
              <Item.Content>
                <Item.Meta>
                  {format(obj.createdAt, 'MMM DD, HH:mm A')} {obj.updatedAt > obj.createdAt && '(edited)'} <Icon name='edit' onClick={() => setEditable(editable => editable === id ? null : id)} />
                  {obj.tags}
                </Item.Meta>
                <Item.Description>
                  {
                    id === editable
                      ? <EditForm text={obj.text} onSubmit={(evt, text) => updateText({ id, text })} onCancel={() => setEditable(null)} />
                      : <div
                        className='markdown-body'
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(markdown.toHTML(obj.text))
                        }}
                      />
                  }
                  <Icon name='trash' onClick={() => onRemove(id)} />
                </Item.Description>
              </Item.Content>
            </Item>
          </React.Fragment>
        ))
      }
    </Item.Group>
  )
}

function Home () {
  const { firebase, authUser } = useContext(FirebaseContext)
  const onSignOut = () => firebase.auth.signOut()
  return (
    <PageContextProvider>
      <Button onClick={onSignOut}>Sign Out</Button>
    Home
      <LogForm />
      <LogList authUser={authUser} />
    </PageContextProvider>
  )
}

export default Home
