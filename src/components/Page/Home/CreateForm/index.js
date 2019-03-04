import React, { useState, useContext, useEffect } from 'react'

import FirebaseContext from 'context/Firebase'

import style from './index.module.css'

import {
  Container
} from 'semantic-ui-react'

const CreateForm = ({ id: selectedId }) => {
  const [ id, setId ] = useState(selectedId)
  const [ text, setText ] = useState('')
  const [ title, setTitle ] = useState('')
  const { logsRef } = useContext(FirebaseContext)

  const onRemove = async (id) => {
    console.log('deleting')
    logsRef.child(id).remove()
    setId(undefined)
  }

  const handleCreateOrUpdate = (text, title) => {
    if (text && title) {
      if (id) onUpdate(text, title)
      else onCreate(text, title)
      return
    }
    if (!text && !title && id) onRemove(id)
  }

  const onUpdate = async (text, title) => {
    console.log('updating', text, title)
    try {
      await logsRef.child(id).update({
        text,
        title,
        updatedAt: Date.now()
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  const onCreate = async (text, title) => {
    console.log('creating', text, title)
    try {
      const now = Date.now()
      const result = await logsRef.push({
        createdAt: now,
        updatedAt: now,
        text: text,
        title: title
      })
      console.log('result', result)
      setId(result.key)
    } catch (error) {
      console.log('error', error)
    }
  }

  const onChangeTextArea = (evt) =>
    setText(evt.currentTarget.value)

  const onChangeTitle = (evt) =>
    setTitle(evt.currentTarget.value)

  useEffect(() => {
    const timeout = window.setTimeout(() => {
      console.log('in timeout', text, title)
      handleCreateOrUpdate(text.trim(), title.trim())
    }, 250)
    return () => {
      window.clearTimeout(timeout)
    }
  }, [text, title])

  return (
    <Container className={style.createForm}>
      <input className={style.input} value={title} placeholder='Title' onChange={onChangeTitle} />
      <textarea className={style.textarea} value={text} placeholder='Additional notes' onChange={onChangeTextArea} autoHeight required />
    </Container>
  )
}

export default CreateForm
