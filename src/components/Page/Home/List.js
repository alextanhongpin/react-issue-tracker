import React, { useState, useContext } from 'react'

import { format, distanceInWordsToNow } from 'date-fns'
import { markdown } from 'markdown'
import DOMPurify from 'dompurify'

import FirebaseContext from 'context/Firebase'
import PageContext from 'components/Page/Home/context'

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

  const onRemove = async (id) =>
    logsRef.child(id).remove()

  return (
    <Container>
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
    </Container>
  )
}

export default List
