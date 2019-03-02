import React, { useState, useContext } from 'react'

import { format, distanceInWordsToNow } from 'date-fns'
// import { markdown } from 'markdown'
import DOMPurify from 'dompurify'

import FirebaseContext from 'context/Firebase'
import PageContext from 'components/Page/Home/context'

import style from './index.module.css'
import {
  Container,
  Divider,
  Item,
  Icon
} from 'semantic-ui-react'

import EditForm from 'components/Page/Home/EditForm'
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
          logs.map(([id, obj]) => {
            const isEdited = obj.updatedAt > obj.createdAt && '(edited)'
            const dateFormatted = format(obj.createdAt, 'DD/MM/YYYY')
            const editIcon = <Icon className={style.editIcon} name='edit' onClick={() => setEditable(editable => editable === id ? null : id)} />
            const deleteIcon = <Icon name='trash' onClick={() => onRemove(id)} />

            return (
              <div key={id} className={style.list}>
                <div className={style.listDate}>{dateFormatted}</div>
                <div>{obj.title} {isEdited} {editIcon}</div>
                <div>{distanceInWordsToNow(obj.createdAt)}</div>
                <div className={style.text}>
                  {
                    id === editable
                      ? <EditForm text={obj.text} title={obj.title} onSubmit={(evt, text, title) => updateText({ id, text, title })} onCancel={() => setEditable(null)} />
                      : <div
                        className='markdown-body'
                        dangerouslySetInnerHTML={{
                          __html: DOMPurify.sanitize(obj.text)
                        }}
                      />

                  }</div>
              </div>
            )
          })

        }
      </div>
    </Container>
  )
}

export default List
