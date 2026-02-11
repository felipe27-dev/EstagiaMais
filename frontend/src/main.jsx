import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import "@/styles/index.css";
import App from './App.jsx'

// Função para iniciar o mock antes de renderizar o app
async function enableMocking() {
  if (process.env.NODE_ENV !== 'development') {
    return
  }

  const { worker } = await import('./mocks/browser')
  return worker.start({
    onUnhandledRequest: 'bypass',
  })
}

// Primeiro liga os mocks, depois renderiza
enableMocking().then(() => {
  createRoot(document.getElementById('root')).render(
    <StrictMode>
      <App />
    </StrictMode>,
  )
})