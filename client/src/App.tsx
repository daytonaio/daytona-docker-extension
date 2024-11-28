import { useEffect, useRef, useState } from 'react'
import { Box, Button, Grid, LinearProgress, Typography } from '@mui/material'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'
import { useXTerm } from 'react-xtermjs'
import { FitAddon } from '@xterm/addon-fit'

import StartScreen from './components/StartScreen'
import CreateWorkspace from './components/CreateWorkspace'
import { useApiClient } from './providers/ApiClientProvider'
import { useDaytonaConfig } from './providers/DaytonaConfigProvider'
import { useDockerClient } from './providers/DockerClientProvider'
import SwitchProfile from './components/shared/SwitchProfile'
import Logs from './components/Logs'

const router = createMemoryRouter([
  {
    path: '/',
    element: <StartScreen />,
  },
  {
    path: '/create',
    element: <CreateWorkspace />,
  },
  {
    path: '/logs',
    element: <Logs />,
  },
])

export function App() {
  const { isServerRuning, workspaceApiClient } = useApiClient()
  const { daytonaConfig } = useDaytonaConfig()
  const fitAddon = useRef(new FitAddon())
  const { instance, ref } = useXTerm()
  const [isTerminalHidden, setIsTerminalHidden] = useState(true)
  const [startingServer, setStartingServer] = useState(false)
  const client = useDockerClient()

  useEffect(() => {
    if (instance) {
      instance.loadAddon(fitAddon.current)
      fitAddon.current.fit()
    }
  }, [instance])

  const onStartServer = async () => {
    setIsTerminalHidden(false)
    setStartingServer(true)
    try {
      await new Promise<void>((resolve, reject) => {
        const result = client?.extension.host?.cli.exec(
          'daytona',
          ['server', '-y'],
          {
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
          },
        )
      })
    } catch (error: any) {
      instance?.write(error)
    }
  }

  if (client?.host.platform === 'win32' && !isServerRuning) {
    return (
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        gap={2}
        padding="48px 32px"
      >
        <Typography variant="h5">
          Starting the Server here is not supported on Windows.
        </Typography>
        <Typography variant="h6" mt={4}>
          Please run `daytona serve` in a terminal and the extension will
          connect automatically.
        </Typography>
      </Box>
    )
  }

  return (
    <>
      {isServerRuning ? (
        <RouterProvider router={router} />
      ) : (
        <>
          {workspaceApiClient || daytonaConfig?.activeProfile === '' ? (
            <Box
              display="flex"
              flexDirection="column"
              alignItems="center"
              gap={2}
              padding="48px 32px"
            >
              <Typography variant="h5">
                {startingServer
                  ? 'Starting the Daytona Server...'
                  : 'Daytona Server is not running'}
              </Typography>
              {(daytonaConfig?.activeProfile === 'default' ||
                !daytonaConfig?.activeProfile) &&
                isTerminalHidden && (
                  <Button
                    variant="contained"
                    onClick={onStartServer}
                    size="large"
                  >
                    Start Server
                  </Button>
                )}
              {daytonaConfig?.profiles &&
                daytonaConfig?.profiles.length > 1 && (
                  <>
                    <Typography variant="h6" mt={4}>
                      You can switch to a different profile
                    </Typography>
                    <SwitchProfile />
                  </>
                )}
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
        hidden={isServerRuning || isTerminalHidden}
      />
    </>
  )
}
