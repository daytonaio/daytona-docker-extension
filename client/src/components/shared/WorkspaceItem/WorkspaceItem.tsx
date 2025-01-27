import { FC } from 'react'
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
import { ModelsResourceStateName, WorkspaceDTO } from '../../../api-client'
import { useDockerClient } from '../../../providers/DockerClientProvider'
import OpenInEditorButton from './OpenInEditorButton'
import { Editor } from '../../../constants/editors'
import { mapResourceStateToStatus } from '../../../helpers/workspaceHelper'

const WorkspaceItem: FC<{
  workspace: WorkspaceDTO
  onDelete: () => void
  preferedEditor?: Editor
  openInEditor: (
    createdWorkspaceId: string,
    createdWorkspaceName: string,
    editor: Editor,
  ) => void
}> = ({ workspace, onDelete, preferedEditor, openInEditor }) => {
  const client = useDockerClient()

  const openRepo = () => {
    // @ts-ignore
    client?.openExternal(workspace.repository.url)
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
          <Typography variant="subtitle1">
            {workspace.repository.name}
          </Typography>
          <Link
            onClick={openRepo}
            color="secondary"
            sx={{
              cursor: 'pointer',
              textDecoration: 'none',
              ':hover': { textDecoration: 'underline' },
            }}
          >
            {workspace.repository.url}
            <LaunchIcon />
          </Link>
        </Box>
      </TableCell>
      <TableCell>
        <Chip
          label={workspace.state.name}
          color={mapResourceStateToStatus(workspace.state.name)}
          sx={{ padding: '14px' }}
        />
      </TableCell>
      <TableCell>{workspace.target.name}</TableCell>
      <TableCell>
        <Box
          display="flex"
          gap={2}
          justifyContent="flex-end"
          alignItems="center"
        >
          {workspace.state.name ===
            ModelsResourceStateName.ResourceStateNameStarted && (
            <OpenInEditorButton
              onSelect={(editor) =>
                openInEditor(workspace.id, workspace.name, editor)
              }
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
