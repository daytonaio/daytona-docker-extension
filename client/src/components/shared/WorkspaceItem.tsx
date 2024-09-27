import { FC, useCallback, useMemo, useState } from 'react'
import {
  Box,
  Button,
  Typography,
  IconButton,
  CircularProgress,
  TableRow,
  TableCell,
  Chip,
  Link,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import LaunchIcon from '@mui/icons-material/Launch'
import { WorkspaceDTO } from '../../api-client'
import { useDockerClient } from '../../providers/DockerClientProvider'
import VsCodeIcon from './icons/VsCodeIcon'

const WorkspaceItem: FC<{
  workspace: WorkspaceDTO
  onDelete: () => void
}> = ({ workspace, onDelete }) => {
  const client = useDockerClient()
  const [loadingPath, setLoadingPath] = useState(false)

  const isWorkspaceRunning = useMemo(() => {
    return workspace.projects[0].state && workspace.projects[0].state.uptime > 0
  }, [workspace])

  const getCodePath = useCallback(
    async (data: WorkspaceDTO) => {
      try {
        await new Promise<void>((resolve, reject) => {
          const result = client?.extension.host?.cli.exec(
            'daytona',
            ['ssh', data.id, data.name, 'echo $HOME'],
            {
              stream: {
                onOutput: (message: any) => {
                  try {
                    setWorkspacePath(
                      `${message.stdout.trim()}/${workspace.projects[0].name}`,
                    )
                  } catch (error) {
                    reject(error)
                  }
                },
                onClose: () => resolve(),
                onError: (error: any) => reject(error),
              },
            },
          )
        })

        if (!path) {
          await new Promise<void>((resolve, reject) => {
            client?.extension.host?.cli.exec(
              'daytona',
              ['ssh', data.id, data.name, 'echo $HOME'],
              {
                stream: {
                  onOutput: (message: any) => {
                    if (message.stdout) {
                      path = `${message.stdout.trim()}/${
                        workspace.projects[0].name
                      }`
                    }
                  },
                  onClose: () => resolve(),
                  onError: (error: any) => reject(error),
                },
              },
            )
          })
        }

        return path
      } catch (error) {
        console.log(error)
      }
    },
    [client],
  )

  const openInVsCode = async () => {
    setLoadingPath(true)
    const path = await getCodePath(workspace)

    setLoadingPath(false)
    if (path) {
      const a = document.createElement('a')
      a.href = `vscode://vscode-remote/ssh-remote+default-${workspace.id}-${workspace.projects[0].name}${path}?windowId=_blank`
      a.click()
      a.remove()
    } else {
      client?.desktopUI.toast.error('Failed to open in editor')
    }
  }

  const openRepo = () => {
    client?.openExternal(workspace.projects[0].repository.url)
  }

  return (
    <TableRow
      sx={{ '&:last-child td, &:last-child th': { border: 0 }, height: 50 }}
    >
      <TableCell>
        <Box
          display="flex"
          flexDirection={'column'}
          gap={1}
          alignItems="flex-start"
        >
          <Typography variant="subtitle1">{workspace.name}</Typography>
          <Link
            onClick={openRepo}
            color="secondary"
            sx={{
              cursor: 'pointer',
              textDecoration: 'none',
              ':hover': { textDecoration: 'underline' },
            }}
          >
            {workspace.projects[0].repository.url}
            <LaunchIcon />
          </Link>
        </Box>
      </TableCell>
      <TableCell>
        {isWorkspaceRunning ? (
          <Chip label="Running" color="success" sx={{ padding: '14px' }} />
        ) : (
          <Chip label="Stopped" color="error" sx={{ padding: '14px' }} />
        )}
      </TableCell>
      <TableCell>
        <Box display={'flex'} gap={2} justifyContent="flex-end">
          {isWorkspaceRunning && (
            <Button
              startIcon={
                loadingPath ? (
                  <CircularProgress size="16px" color="info" />
                ) : (
                  <VsCodeIcon />
                )
              }
              size="small"
              variant="contained"
              onClick={openInVsCode}
            >
              VS CODE
            </Button>
          )}
          <IconButton aria-label="delete" color="error" onClick={onDelete}>
            <DeleteIcon />
          </IconButton>
        </Box>
      </TableCell>
    </TableRow>
  )
}

export default WorkspaceItem
