import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App'
import Loja from './Loja'

const isLoja = window.location.pathname === '/loja' || window.location.pathname === '/loja/'

ReactDOM.createRoot(document.getElementById('root')).render(
  isLoja ? <Loja /> : <App />
)
