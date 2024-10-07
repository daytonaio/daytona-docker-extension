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
  const [isLoading, setIsLoading] = useState(false)

  const isWorkspaceRunning = useMemo(() => {
    return workspace.projects[0].state && workspace.projects[0].state.uptime > 0
  }, [workspace])

  const openInEditor = async () => {
    setIsLoading(true)
    try {
      await new Promise<void>((resolve, reject) => {
        client?.extension.host?.cli.exec(
          'daytona',
          ['code', workspace.id, workspace.name, '--ide', 'vscode'],
          {
            stream: {
              onOutput: (message: any) => {
                if (message.stderr) {
                  client?.desktopUI.toast.error(
                    `Error with opening editor. ${message.stderr}`,
                  )
                  resolve()
                }
              },
              onClose: () => resolve(),
              onError: (error: any) => reject(error),
            },
          },
        )
      })
    } catch (error) {
      console.log(error)
    }
    setIsLoading(false)
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
              sx={{
                width: 120,
                justifyContent: 'space-between',
              }}
              startIcon={
                isLoading ? (
                  <CircularProgress size="16px" color="info" />
                ) : (
                  <VsCodeIcon />
                )
              }
              size="small"
              variant="contained"
              onClick={openInEditor}
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
