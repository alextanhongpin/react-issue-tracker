import React, { useState, useContext } from 'react'

import { format, distanceInWordsToNow } from 'date-fns'
// import { markdown } from 'markdown'
import DOMPurify from 'dompurify'

import FirebaseContext from 'context/Firebase'
import PageContext from 'components/Page/Home/context'

import style from './index.module.css'
import {
  Container,
  Icon
} from 'semantic-ui-react'

import EditForm from 'components/Page/Home/EditForm/index.js'

const ListItem = ({ id, updatedAt, createdAt, title, text, onEdit, onCancel, editable, onRemove, onSubmit }) => {
  const [visible, setVisible] = useState(false)
  const isEdited = updatedAt > createdAt && '(edited)'
  const dateFormatted = format(createdAt, 'DD/MM/YYYY')
  const editIcon = <Icon className={style.editIcon} name='edit' onClick={() => onEdit(id)} />
  // const deleteIcon = <Icon name='trash' onClick={() => onRemove(id)} />

  return (
    <div className={style.list} onClick={() => setVisible(isVisible => !isVisible)}>
      <div className={[style.listDate, 'mono'].join(' ')}>{dateFormatted}</div>
      <div>{title} {isEdited} {editIcon}</div>
      <div>{distanceInWordsToNow(createdAt)} ago</div>
      <div className={style.text} style={{ display: visible ? 'block' : 'none' }}>
        {
          id === editable && <EditForm text={text} title={title} onSubmit={(evt, text, title) => onSubmit({ id, text, title })} onCancel={() => onCancel(id)} />
        }
        {visible && <div
          dangerouslySetInnerHTML={{
            __html: DOMPurify.sanitize(text)
          }}
        />}

      </div>
    </div>
  )
}

const List = () => {
  const [editable, setEditable] = useState(false)
  const { state } = useContext(PageContext)

  const logs = Array.from(state.logs)
  const { logsRef } = useContext(FirebaseContext)
  const updateText = async ({ id, text, title }) => {
    try {
      await logsRef.child(id).update({
        text,
        title,
        updatedAt: Date.now()
      })
      setEditable(null)
    } catch (error) {
      console.log('error updating:', error)
    }
  }

  const onRemove = async (id) =>
    logsRef.child(id).remove()

  return (
    <Container>
      <div style={{ whiteSpace: 'pre-wrap' }}>

        {
          logs.map(([id, obj]) => (
            <ListItem
              key={id}
              id={id}
              {...obj}
              editable={editable}
              onEdit={id => setEditable(editable => editable === id ? null : id)}
              onCancel={id => setEditable(null)}
              onSubmit={(evt, text, title) => updateText({ id, text, title })}
              onRemove={id => onRemove(id)}
            />
          )
          )

        }
      </div>
    </Container>
  )
}

export default List
