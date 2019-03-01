import React, { useContext } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import FirebaseContext from 'context/Firebase'

import Home from 'components/Page/Home'

import style from './App.module.css'

const App = () => {
  const { firebase, authUser } = useContext(FirebaseContext)
  const onSignOut = () => firebase.auth.signOut()
  return (
    <Router>
      <>
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
      </>
    </Router>
  )
}

export default App
