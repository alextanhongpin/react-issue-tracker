import React, { useContext } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import FirebaseContext from 'context/Firebase'

import Home from 'components/Page/Home'
import createStore, { StateProvider } from 'store'

import style from './App.module.css'

const App = () => {
  const { firebase, authUser } = useContext(FirebaseContext)
  const onSignOut = () => firebase.auth.signOut()

  const { state, reducer } = createStore()
  return (
    <Router>
      <StateProvider
        initialState={state}
        reducer={reducer}
      >
        <header className={style.header}>
          <div className={style.headerBrandWrapper}><div className={style.headerBrand}>Issue</div><div>Tracker</div></div>

          <div className={style.headerAside}>
            <div className={style.userInfoWrapper}>
              <div className={style.userName}>{authUser.displayName}</div>
              <img className={style.userPhoto} src={authUser.photoURL} />
            </div>
            <a title='Log out of the application' className={style.headerButton} onClick={onSignOut}>Sign Out</a>
          </div>
        </header>
        <br />
        <Switch>
          <Route exact path='/' component={Home} />
        </Switch>
      </StateProvider>
    </Router>
  )
}

export default App
