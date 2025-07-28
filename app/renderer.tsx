import React from 'react'
import ReactDOM from 'react-dom/client'
import appIcon from '@/resources/build/icon.png'
import { WindowContextProvider, menuItems } from '@/lib/window'
import App from './App'
import './styles/app.css'

ReactDOM.createRoot(document.getElementById('app') as HTMLElement).render(
  <WindowContextProvider titlebar={{ title: 'Ai Chat Client', icon: appIcon, menuItems }}>
    <App />
  </WindowContextProvider>
)
