import React, { Component } from 'react'
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom'

import { Container } from 'semantic-ui-react'

import Home from 'components/Page/Home'

class App extends Component {
  // registerExpensesListener () {
  //   const { firebase } = this.props
  //   firebase.expensesRef.once('value').then(snapshot => {
  //     const entries = Object.entries(snapshot.val())
  //     const parsedEntries = entries.map(([key, obj]) => [key, { ...obj, date: Calendar.YYYYMMDD(obj.createdAt) }])
  //     this.setState({
  //       expenses: new Map(parsedEntries)
  //     })
  //   })
  //   firebase.expensesRef.on('child_added', (snapshot) => {
  //     this.setState(state => {
  //       const obj = snapshot.val()
  //       state.expenses.set(snapshot.key, { ...obj, date: Calendar.YYYYMMDD(obj.createdAt) })
  //       return { ...state, expenses: state.expenses }
  //     })
  //   })
  //   firebase.expensesRef.on('child_changed', (snapshot) => {
  //     this.setState(state => {
  //       const obj = snapshot.val()
  //       state.expenses.set(snapshot.key, { ...obj, date: Calendar.YYYYMMDD(obj.createdAt) })
  //       return { ...state, expenses: state.expenses }
  //     })
  //   })
  //   firebase.expensesRef.on('child_removed', (snapshot) => {
  //     this.setState(state => {
  //       state.expenses.delete(snapshot.key)
  //       return { ...state, expenses: state.expenses }
  //     })
  //   })
  //   // firebase.range(new Date(), new Date())
  // }
  //
  // componentDidMount () {
  //   const { firebase } = this.props
  //   firebase.signInAnonymously().catch(console.error)
  //   this.listener = firebase.auth.onAuthStateChanged(authUser => {
  //     authUser
  //       ? this.setState({ authUser })
  //       : this.setState({ authUser: null })
  //   })
  //   this.registerExpensesListener()
  // }
  //
  // componentWillUnmount () {
  //   // Avoid memory leaks by unbinding the listener at the end.
  //   this.listener()
  //   this.props.firebase.expensesRef.off()
  // }
  //
  render () {
    return (
      <Router>
        <Container>
          <Switch>
            <Route exact path='/' component={Home} />
          </Switch>
        </Container>
      </Router>
    )
  }
}

export default App
