import { useEffect, useRef, useState } from 'react'
import { Box, Typography } from '@mui/material'

import Header from './shared/Header'
import { ReactComponent as Logo } from '../assets/logo.svg'
import { WorkspaceDTO } from '../api-client'
import { AxiosResponse } from 'axios'
import { useApiClient } from '../providers/ApiClientProvider'
import WorkspaceList from './shared/WorkspaceList'

const StartScreen = () => {
  const { workspaceApiClient } = useApiClient()
  const [workspaces, setWorkspaces] = useState<Array<WorkspaceDTO>>([])
  const listRef = useRef()

  const fetchWorkspaces = async () => {
    if (workspaceApiClient) {
      workspaceApiClient
        .listWorkspaces()
        .then((response: AxiosResponse<WorkspaceDTO[], any>) => {
          setWorkspaces(response.data)
        })
        .catch((error: any) => {
          console.log(error)
        })
    }
  }
  useEffect(() => {
    if (workspaceApiClient) {
      fetchWorkspaces()
    }
  }, [workspaceApiClient])
  const handleDelete = (workspace: WorkspaceDTO) => {
    if (workspaceApiClient) {
      workspaceApiClient
        .deleteWorkspace(workspace.id, true)
        .then(() => {
          fetchWorkspaces()
        })
        .catch((error: any) => {
          console.log(error)
        })
    }
  }

  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Header />

      {workspaces.length > 0 ? (
        <Box width="100%" p={4} mt={4}>
          <Typography variant="h2" mb={2}>
            Workspaces
          </Typography>
          <WorkspaceList
            workspaces={workspaces}
            onDelete={handleDelete}
            ref={listRef}
          />
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" pt={4}>
          <Logo width={60} height={60} />
          <Typography mt={4} variant="h6" textAlign={'center'}>
            The Open Source Development Environment Manager <br />
            Set up a development environment on any infrastructure, with a
            single click
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default StartScreen
