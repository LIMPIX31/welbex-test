import React from 'react'
import ReactDOM from 'react-dom/client'
import { App } from 'App'
import { Styles } from 'style'

// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Styles />
    <App />
  </React.StrictMode>,
)
