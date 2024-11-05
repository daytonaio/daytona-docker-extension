import { Box, Typography } from '@mui/material'
import { FC, useEffect, useRef } from 'react'
import { FitAddon } from '@xterm/addon-fit'

import Header from './shared/Header'
import { useXTerm } from 'react-xtermjs'
import { useLocation } from 'react-router-dom'
import { useDockerClient } from '../providers/DockerClientProvider'

const Logs: FC = () => {
  const fitAddon = useRef(new FitAddon())
  const { instance, ref: terminalRef } = useXTerm()
  const { state } = useLocation()
  const client = useDockerClient()

  useEffect(() => {
    if (instance) {
      instance.loadAddon(fitAddon.current)
      fitAddon.current.fit()
    }
  }, [instance])

  useEffect(() => {
    if (instance && state) {
      const openInEditor = async () => {
        try {
          await new Promise<void>((resolve, reject) => {
            let stderr = ''
            client?.extension.host?.cli.exec(
              'daytona',
              [
                'code',
                state.createdWorkspaceId,
                state.createdWorkspaceName,
                '--ide',
                state.editor,
              ],
              {
                stream: {
                  onOutput: (message: any) => {
                    if (message.stderr) {
                      message.stderr = message.stderr.replaceAll('\n', '\r\n')
                      instance?.write(message.stderr)
                      stderr += message.stderr
                    }
                    if (message.stdout) {
                      message.stdout = message.stdout.replaceAll('\n', '\r\n')
                      instance?.write(message.stdout)
                    }
                  },
                  onClose: () => resolve(),
                  onError: (error: any) => {
                    if (!error) {
                      resolve()
                      return
                    }

                    client?.desktopUI.toast.error(
                      `Error with opening editor. ERROR: ${JSON.stringify(
                        error,
                      )} ${stderr}`,
                    )
                    reject(error)
                  },
                },
              },
            )
          })
        } catch (error) {
          console.log(error)
        }
      }

      openInEditor()
    }
  }, [instance, state])

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Header />

      <Box
        width="100%"
        py={4}
        mt={2}
        display="flex"
        flexDirection="column"
        gap={2}
      >
        <Typography variant="h2" textAlign="center" mb={2}>
          Editor logs
        </Typography>
        <Box ref={terminalRef} width={'100%'} />
      </Box>
    </Box>
  )
}

export default Logs
