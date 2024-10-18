import { FC, forwardRef, useEffect, useImperativeHandle, useState } from 'react'
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
  Box,
} from '@mui/material'

import { WorkspaceDTO } from '../../api-client'
import WorkspaceItem from './WorkspaceItem/WorkspaceItem'
import { Editor } from '../../constants/editors'
import { useXTerm } from 'react-xtermjs'
import { useDockerClient } from '../../providers/DockerClientProvider'

interface Props {
  workspaces: WorkspaceDTO[]
  onDelete: (workspace: WorkspaceDTO) => void
  preferedEditor?: Editor
}

const WorkspaceList = forwardRef<any, Props>((props, ref) => {
  const { workspaces, onDelete, preferedEditor } = props
  const [workspaceToDelete, setWorkspaceToDelete] =
    useState<WorkspaceDTO | null>(null)
  const { instance, ref: terminalRef } = useXTerm()
  const client = useDockerClient()
  const [isLoading, setIsLoading] = useState(false)
  const [isEditorHidden, setIsEditorHidden] = useState(true)

  const handleClose = () => {
    setWorkspaceToDelete(null)
  }

  const openInEditor = async (
    createdWorkspaceId: string,
    createdWorkspaceName: string,
    editor: Editor,
  ) => {
    setIsEditorHidden(false)
    setIsLoading(true)
    instance?.reset()

    try {
      await new Promise<void>((resolve, reject) => {
        let stderr = ''
        client?.extension.host?.cli.exec(
          'daytona',
          ['code', createdWorkspaceId, createdWorkspaceName, '--ide', editor],
          {
            stream: {
              onOutput: (message: any) => {
                if (message.stderr) {
                  instance?.writeln(message.stderr)
                  stderr += message.stderr
                }
                if (message.stdout) {
                  instance?.writeln(message.stdout)
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

  useImperativeHandle(ref, () => ({
    openInEditor,
  }))

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
                width: 200,
              }}
            >
              TARGET
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
              isLoading={isLoading}
              openInEditor={openInEditor}
            />
          ))}
        </TableBody>
      </Table>
      <Box mt={8}>
        <Box ref={terminalRef} width={'100%'} hidden={isEditorHidden} />
      </Box>
    </>
  )
})

export default WorkspaceList
