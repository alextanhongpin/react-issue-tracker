import app from 'firebase/app'
import 'firebase/database'
import 'firebase/auth'

const config = Object.freeze({
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  databaseURL: process.env.REACT_APP_DATABASE_URL,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID
})

const withExpense = superclass => class extends superclass {
  get expensesRef () {
    // return this.database.ref('expenses')
  }

  // async range (start, end) {
  //   const s = startOfDay(start).getTime()
  //   const e = endOfDay(end).getTime()
  //   const snapshot = await this.expensesRef
  //     .orderByChild('createdAt')
  //     .startAt(s)
  //     .endAt(e)
  //     .once('value')
  //   return snapshot.val()
  // }
}

class Firebase {
  constructor () {
    app.initializeApp(config)
    this.database = app.database()
    this.auth = app.auth()
  }

  signInAnonymously () {
    return this.auth.signInAnonymously()
  }
}

export default Firebase
