import { Grid, LinearProgress, Typography } from '@mui/material'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import StartScreen from './components/StartScreen'
import CreateWorkspace from './components/CreateWorkspace'
import { useApiClient } from './providers/ApiClientProvider'

const router = createMemoryRouter([
  {
    path: '/',
    element: <StartScreen />,
  },
  {
    path: '/create',
    element: <CreateWorkspace />,
  },
])

export function App() {
  const apiClient = useApiClient()

  return (
    <>
      {apiClient ? (
        <RouterProvider router={router} />
      ) : (
        <Grid
          container
          flex={1}
          direction="column"
          padding="16px 32px"
          height="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Grid item>
            <LinearProgress />
            <Typography mt={2}>
              Waiting for Daytona to be ready. It may take some seconds if it's
              the first time.
            </Typography>
          </Grid>
        </Grid>
      )}
    </>
  )
}
