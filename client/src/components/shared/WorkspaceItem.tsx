import { FC, useCallback, useEffect, useState } from 'react'
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
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import { Workspace } from '../../api-client'
import { useDockerClient } from '../../providers/DockerClientProvider'

const WorkspaceItem: FC<{
  workspace: Workspace
  onDelete: (workspace: Workspace) => void
}> = ({ workspace, onDelete }) => {
  const client = useDockerClient()
  const [workspacePath, setWorkspacePath] = useState<string | null>(null)

  const isWorkspaceRunning = (workspace: Workspace) => {
    return workspace.projects[0].state && workspace.projects[0].state.uptime > 0
  }

  useEffect(() => {
    getCodePath(workspace)
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
      } catch (error) {
        console.log(error, '-------')
      }
    },
    [client],
  )

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
            {isWorkspaceRunning(workspace) ? 'Running' : 'Stopped'}
          </Typography>
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
