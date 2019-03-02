import React, { useState, useContext } from 'react'

import FirebaseContext from 'context/Firebase'

import style from './index.module.css'

import {
  Container,
  Button,
  Message,
  Form,
  TextArea
} from 'semantic-ui-react'

const CreateForm = () => {
  const [ text, setText ] = useState('')
  const [ title, setTitle ] = useState('')
  const [ isError, setError ] = useState(null)
  // const [ tags, setTags ] = useState('')
  const { logsRef } = useContext(FirebaseContext)

  const onChangeTextArea = (evt) =>
    setText(evt.currentTarget.value)

  // const onChange = (evt) =>
  //   setTags(evt.currentTarget.value)

  const onChangeTitle = (evt) =>
    setTitle(evt.currentTarget.value)

  const onClick = async (evt) => {
    try {
      const now = Date.now()
      const result = await logsRef.push({
        createdAt: now,
        updatedAt: now,
        text: text.trim(),
        title: title.trim()
        // tags // Cannot include array.
      })
      console.log('result', result)
      // Reset.
      setText('')
      setTitle('')
    } catch (error) {
      setError(error)
      console.log('error', error)
    }
  }

  return (
    <Container className={style.createForm}>
      <h1>Create Entry</h1>

      <Form error={isError}>
        <Form.Field required>
          <label>Title</label>
          <input value={title} placeholder="What's on your mind?" onChange={onChangeTitle} />

        </Form.Field>
        <Form.Field>
          <label>Additional Notes</label>
          <TextArea value={text} placeholder='Additional notes' onChange={onChangeTextArea} autoHeight required />

        </Form.Field>
        <Message header='Error' content={isError && isError.message} error />
        <Button onClick={onClick} size='large' positive>Submit</Button>

      </Form>
    </Container>
  )
}

export default CreateForm
