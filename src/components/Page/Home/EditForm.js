import React, { useState } from 'react'

import {
  Form,
  TextArea,
  Button
} from 'semantic-ui-react'

const EditForm = ({ text: prevText, onSubmit, onCancel }) => {
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

export default EditForm
