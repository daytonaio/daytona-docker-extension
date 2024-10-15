import { FC, useMemo, useState } from 'react'
import {
  Box,
  Typography,
  IconButton,
  TableRow,
  TableCell,
  Chip,
  Link,
} from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import LaunchIcon from '@mui/icons-material/Launch'
import { WorkspaceDTO } from '../../../api-client'
import { useDockerClient } from '../../../providers/DockerClientProvider'
import OpenInEditorButton from './OpenInEditorButton'
import { Editor } from '../../../constants/editors'

const WorkspaceItem: FC<{
  workspace: WorkspaceDTO
  onDelete: () => void
  preferedEditor?: Editor
}> = ({ workspace, onDelete, preferedEditor }) => {
  const client = useDockerClient()
  const [isLoading, setIsLoading] = useState(false)

  const isWorkspaceRunning = useMemo(() => {
    return workspace.projects[0].state && workspace.projects[0].state.uptime > 0
  }, [workspace])

  const openInEditor = async (editor: Editor) => {
    setIsLoading(true)
    try {
      await new Promise<void>((resolve, reject) => {
        let stderr = ''
        client?.extension.host?.cli.exec(
          'daytona',
          ['code', workspace.id, workspace.name, '--ide', editor],
          {
            stream: {
              onOutput: (message: any) => {
                if (message.stderr) {
                  stderr += message.stderr
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
    setIsLoading(false)
  }

  const openRepo = () => {
    // @ts-ignore
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
            <OpenInEditorButton
              onSelect={openInEditor}
              isLoading={isLoading}
              editor={preferedEditor}
            />
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
