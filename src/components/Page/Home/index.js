import React from 'react'

import { PageContextProvider } from 'components/Page/Home/context'
import CreateForm from 'components/Page/Home/CreateForm'
import List from 'components/Page/Home/List/index.js'

import 'github-markdown-css'
import './index.module.css'

const Home = () => {
  return (
    <PageContextProvider>
      <CreateForm />
      <List />
    </PageContextProvider>
  )
}

export default Home
