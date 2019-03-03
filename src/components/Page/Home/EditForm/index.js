import React, { useState } from 'react'

import {
  Form,
  TextArea,
  Button
} from 'semantic-ui-react'

const EditForm = ({ text: prevText, title: prevTitle, onSubmit, onCancel }) => {
  const [ text, setText ] = useState(prevText)
  const [ title, setTitle] = useState(prevTitle)

  const onChangeTextArea = (evt) =>
    setText(evt.currentTarget.value)

  const onChangeTitle = (evt) =>
    setTitle(evt.currentTarget.value)
  return (
    <Form>
      <Form.Field>
        <label>Title</label>
        <input
          value={title}
          placeholder='Enter what you have done here'
          onChange={onChangeTitle} />
      </Form.Field>
      <Form.Field>
        <label>Description</label>
        <TextArea value={text} placeholder='Enter what you have done here' onChange={onChangeTextArea} autoHeight />
      </Form.Field>
      <Button onClick={(evt) => onSubmit(evt, text, title)} positive>Submit</Button>
      <Button onClick={onCancel}>Cancel</Button>
    </Form>
  )
}

export default EditForm
