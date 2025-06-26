import React from 'react'
import { Router, RouterProvider } from 'react-router-dom'
import { router } from './routes/Router'
import { Toaster } from 'react-hot-toast'

const App = () => {
  return <>

    <RouterProvider router={router} />
    <Toaster
      position="top-right"
      toastOptions={{
        style: {
          borderRadius: '8px',
          background: '#333',
          color: '#fff',
        },
      }}
    />
  </>
}

export default App