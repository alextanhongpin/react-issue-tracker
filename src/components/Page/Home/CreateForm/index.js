import React, { useState, useContext } from 'react'

import FirebaseContext from 'context/Firebase'
import DOMPurify from 'dompurify'
import { markdown } from 'markdown'

import style from './index.module.css'

import {
  Container,
  Button,
  Form,
  TextArea
} from 'semantic-ui-react'

const CreateForm = () => {
  const [ text, setText ] = useState('')
  const [ tags, setTag ] = useState('')
  const { logsRef, authUser } = useContext(FirebaseContext)

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

  const markup = {
    __html: DOMPurify.sanitize(markdown.toHTML(text))
  }
  return (
    <Container className={style.createForm}>
      <h1>Create Entry</h1>


      <Form>
        <Form.Field>
          <TextArea value={text} placeholder="What's on your mind?" onChange={onChangeTextArea} autoHeight required />

        </Form.Field>
        <Form.Field>
          <label>Tags</label>
          <input type='text' name='tags' value={tags} onChange={onChange} placeholder='Enter tags separated by commas' />
        </Form.Field>
        <Button onClick={onClick} positive>Submit</Button>
      </Form>

      <article
        className='markdown-body'
        dangerouslySetInnerHTML={markup} />
    </Container>
  )
}

export default CreateForm
