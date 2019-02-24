import React, { useState, useEffect } from 'react'
import Firebase from 'context/Firebase/firebase'

const firebase = new Firebase()

const FirebaseContext = React.createContext(null)

const withFirebaseContext = Component => props => (
  <FirebaseContext.Consumer>
    {firebase => <Component {...props} firebase={firebase} />}
  </FirebaseContext.Consumer>
)

function FirebaseProvider ({ children }) {
  const [authUser, setAuthUser] = useState(null)
  const [authError, setAuthError] = useState(null)

  async function login () {
    try {
      await firebase.signInAnonymously()
      setAuthError(null)
    } catch (error) {
      console.log('error', error)
      setAuthError(error)
    }
  }

  useEffect(() => {
    login()
    return firebase.auth.onAuthStateChanged(authUser =>
      setAuthUser(authUser || null)
    )
  }, [])

  const value = { firebase, authUser, authError }
  return (
    <FirebaseContext.Provider value={value}>
      {children}
    </FirebaseContext.Provider>
  )
}

export default FirebaseContext

export { withFirebaseContext, FirebaseProvider }
