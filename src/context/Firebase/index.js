import React, { useState, useEffect } from 'react'
import Firebase from 'context/Firebase/firebase'
import LoginForm from 'context/Firebase/ui.tsx'

const firebase = new Firebase()

const FirebaseContext = React.createContext(null)

const withFirebaseContext = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
)

function FirebaseProvider ({ children }) {
  const [authUser, setAuthUser] = useState(null)

  useEffect(() => {
    return firebase.auth.onAuthStateChanged(authUser =>
      setAuthUser(authUser || null)
    )
  }, [])

  if (!authUser) {
    return <LoginForm firebase={firebase} />
  }

  const logsRef = firebase.database.ref(`/logs/${authUser.uid}`)
  const value = { firebase, authUser, logsRef }
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
}

export default FirebaseContext

export { withFirebaseContext, FirebaseProvider }
