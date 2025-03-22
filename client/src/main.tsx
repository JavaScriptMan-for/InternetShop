import "../src/sass/index.scss"
import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import App from './App.tsx'
import { BrowserRouter } from 'react-router-dom'
import { Provider } from "react-redux"
import { QueryClientProvider, QueryClient } from "@tanstack/react-query"
import store from "../store/store.ts"

const Query_client = new QueryClient();

createRoot(document.getElementById('root')!).render(

  <StrictMode>
      <BrowserRouter>
      <QueryClientProvider client={Query_client}>
      <Provider store={store}>
    <App />
    </Provider>
    </QueryClientProvider>
    </BrowserRouter>
  </StrictMode>,
)
