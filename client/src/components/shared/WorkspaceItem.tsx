import { FC, useCallback, useMemo, useState } from 'react'
import {
  Box,
  Button,
  ListItem,
  ListItemText,
  Typography,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  CircularProgress,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Workspace } from '../../api-client'
import { useDockerClient } from '../../providers/DockerClientProvider'

const WorkspaceItem: FC<{
  workspace: Workspace
  onDelete: (workspace: Workspace) => void
}> = ({ workspace, onDelete }) => {
  const client = useDockerClient()
  const [openDialog, setOpenDialog] = useState(false)
  const [loadingPath, setLoadingPath] = useState(false)

  const handleClickOpen = () => {
    setOpenDialog(true)
  }

  const handleClose = () => {
    setOpenDialog(false)
  }

  const handleDelete = () => {
    onDelete(workspace)
  }

  const isWorkspaceRunning = useMemo(() => {
    return workspace.projects[0].state && workspace.projects[0].state.uptime > 0
  }, [workspace])

  const getCodePath = useCallback(
    async (data: Workspace) => {
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
          console.log('2222')
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

  return (
    <ListItem divider>
      <Box
        display={'flex'}
        alignItems="center"
        gap={2}
        justifyContent="space-between"
        width={'100%'}
      >
        <Box display={'flex'} alignItems="center" gap={3}>
          <ListItemText>
            <Typography variant="subtitle2">{workspace.name}</Typography>
          </ListItemText>
          <ListItemText secondary={workspace.projects[0].repository.url} />
          <Typography
            color={isWorkspaceRunning(workspace) ? 'success.main' : 'error'}
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <ListItem divider>
        <Box
          display={'flex'}
          alignItems="center"
          gap={2}
          justifyContent="space-between"
          width={'100%'}
        >
          <Box display={'flex'} alignItems="center" gap={3}>
            <ListItemText>
              <Typography variant="subtitle2">{workspace.name}</Typography>
            </ListItemText>
            <ListItemText secondary={workspace.projects[0].repository.url} />
            <Typography color={isWorkspaceRunning ? 'success.main' : 'error'}>
              {isWorkspaceRunning ? 'Running' : 'Stopped'}
            </Typography>
          </Box>
          <Box display={'flex'} gap={2}>
            {isWorkspaceRunning && (
              <Button
                startIcon={
                  loadingPath && <CircularProgress size="16px" color="info" />
                }
                size="small"
                variant="contained"
                onClick={openInVsCode}
              >
                Open in VS code
              </Button>
            )}
            <IconButton
              aria-label="delete"
              color="error"
              onClick={handleClickOpen}
            >
              <DeleteIcon />
            </IconButton>
          </Box>
        </Box>
        {workspacePath && (
          <a
            href={`vscode://vscode-remote/ssh-remote+default-${workspace.id}-${workspace.projects[0].name}${workspacePath}?windowId=_blank`}
          >
            <Button size="small" variant="contained">
              Open in VS code
            </Button>
          </a>
        )}
      </Box>
    </ListItem>
  )
}

export default WorkspaceItem
