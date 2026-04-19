import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { BrowserRouter } from 'react-router'
import App from './App.tsx'
// import AuthContextProvider from './contexts/Auth/AuthProvider.tsx'

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    {/* <AuthContextProvider> */}
    <StrictMode>
      <App />
    </StrictMode>
    {/* </AuthContextProvider> */}
  </BrowserRouter>,
)
