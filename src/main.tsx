import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import './index.css'
import App from './App.tsx'

// GitHub Pages serves the app under /rootline/; dev serves at '/'.
const routerBasename = import.meta.env.BASE_URL.startsWith('/')
  ? import.meta.env.BASE_URL
  : '/'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter basename={routerBasename}>
      <App />
    </BrowserRouter>
  </StrictMode>,
)
