import React from 'react'

import { PageContextProvider } from 'components/Page/Home/context'
import CreateForm from 'components/Page/Home/CreateForm/index.js'
import List from 'components/Page/Home/List'

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
