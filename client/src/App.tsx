import { useState } from 'react'
import { Box, Button, Grid, LinearProgress, Typography } from '@mui/material'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { useXTerm } from 'react-xtermjs'

import StartScreen from './components/StartScreen'
import CreateWorkspace from './components/CreateWorkspace'
import { useApiClient } from './providers/ApiClientProvider'
import { useDaytonaConfig } from './providers/DaytonaConfigProvider'
import { useDockerClient } from './providers/DockerClientProvider'
import SwitchProfile from './components/shared/SwitchProfile'

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
  const { isServerRuning, apiClient } = useApiClient()
  const { daytonaConfig } = useDaytonaConfig()
  const { instance, ref } = useXTerm()
  const [isTerminalHidden, setIsTerminalHidden] = useState(true)
  const client = useDockerClient()

  const onStartServer = async () => {
    setIsTerminalHidden(false)
    try {
      await new Promise<void>((resolve, reject) => {
        const result = client?.extension.host?.cli.exec('daytona', ['serve'], {
          stream: {
            onOutput: (message: any) => {
              try {
                if (message.stdout) {
                  message.stdout
                    ?.split('\n')
                    .forEach((line: string) => instance?.writeln(line))
                } else if (message.stderr) {
                  message.stderr
                    ?.split('\n')
                    .forEach((line: string) => instance?.writeln(line))
                }
              } catch (error) {
                reject(error)
              }
            },
            onClose: () => resolve(),
            onError: (error: any) => {
              reject(error)
            },
          },
        })
      })
    } catch (error: any) {
      instance?.write(error)
    }
  }

  return (
    <>
      {isServerRuning ? (
        <RouterProvider router={router} />
      ) : (
        <>
          {apiClient ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              padding="48px 32px"
            >
              <Typography variant="h5">
                Daytona server is not running
              </Typography>
              {daytonaConfig?.activeProfile === 'default' && (
                <Button
                  variant="contained"
                  onClick={onStartServer}
                  size="large"
                >
                  Start Server
                </Button>
              )}
              <Typography variant="h6" mt={4}>
                You can switch to a different profile
              </Typography>
              <SwitchProfile />
            </Box>
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
                  Waiting for Daytona to be ready. It may take some seconds if
                  it's the first time.
                </Typography>
              </Grid>
            </Grid>
          )}
        </>
      )}
      <Box
        ref={ref}
        width={'100%'}
        hidden={isServerRuning || !apiClient || isTerminalHidden}
      />
    </>
  )
}
