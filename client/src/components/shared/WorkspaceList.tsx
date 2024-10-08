import { FC, useState } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  Button,
} from '@mui/material'

import { WorkspaceDTO } from '../../api-client'
import WorkspaceItem from './WorkspaceItem/WorkspaceItem'
import Editor from '../../enums/editor'

const WorkspaceList: FC<{
  workspaces: WorkspaceDTO[]
  onDelete: (workspace: WorkspaceDTO) => void
  preferedEditor?: string
}> = ({ workspaces, onDelete, preferedEditor }) => {
  const [workspaceToDelete, setWorkspaceToDelete] =
    useState<WorkspaceDTO | null>(null)

  const handleClose = () => {
    setWorkspaceToDelete(null)
  }

  return (
    <>
      <Dialog onClose={handleClose} open={!!workspaceToDelete}>
        <DialogTitle>Delete workspace?</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            The '{`${workspaceToDelete?.name}`}' is selected for deletion. Do
            you want to continue?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose} variant="outlined">
            Cancel
          </Button>
          <Button
            onClick={() => {
              onDelete(workspaceToDelete!)
              handleClose()
            }}
            variant="contained"
            color="error"
            autoFocus
          >
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell
              sx={{
                borderColor: 'secondary.dark',
                height: 50,
                fontSize: '12px',
              }}
            >
              NAME
            </TableCell>
            <TableCell
              sx={{
                borderColor: 'secondary.dark',
                height: 50,
                fontSize: '12px',
              }}
            >
              STATUS
            </TableCell>
            <TableCell
              sx={{
                borderColor: 'secondary.dark',
                height: 50,
                fontSize: '12px',
                width: 100,
              }}
              align="left"
            >
              IDE
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {workspaces.map((workspace) => (
            <WorkspaceItem
              key={workspace.id}
              workspace={workspace}
              onDelete={() => setWorkspaceToDelete(workspace)}
              preferedEditor={preferedEditor}
            />
          ))}
        </TableBody>
      </Table>
    </>
  )
}

export default WorkspaceList
