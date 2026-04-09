import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { MantineProvider } from '@mantine/core'
import { RouterProvider } from 'react-router-dom'
import '@mantine/core/styles.css'
import './index.css'
import { router } from './router'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <MantineProvider defaultColorScheme="light">
      <RouterProvider router={router} />
    </MantineProvider>
  </StrictMode>,
)
