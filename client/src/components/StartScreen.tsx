import { useContext, useEffect, useState } from 'react'
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material'

import Header from './shared/Header'
import { ReactComponent as Logo } from '../assets/logo.svg'
import { Workspace } from '../api-client'
import { ApiClientContext } from '../contexts/ApiClientContext'
import WorkspaceItem from './shared/WorkspaceItem'

const StartScreen = () => {
  const apiClient = useContext(ApiClientContext)
  // todo: use Workspace type later
  const [workspaces, setWorkspaces] = useState<Array<any>>([])

  useEffect(() => {
    if (apiClient) {
      apiClient.listWorkspaces().then((response: any) => {
        setWorkspaces(response.data)
      }).catch((error: any) => {
        console.log(error, '-------');        
      })
    }
  }, [apiClient])
  
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Header />

      {workspaces.length > 0 ? (
        <Box width='100%' p={4} mt={4}>
          <Typography variant="h2" mb={2}>Workspaces</Typography>
          <List aria-label="mailbox folders">        
            {workspaces.map((workspace: Workspace) => (
              <WorkspaceItem key={workspace.id} workspace={workspace} />
            ))}
          </List>
        </Box>
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" pt={4}>
          <Logo width={60} height={60} />
          <Typography mt={4} variant="h6" textAlign={'center'}>
            The Open Source Development Environment Manager <br />
            Set up a development environment on any infrastructure, with a single
            click
          </Typography>
        </Box>
      )}
    </Box>
  )
}

export default StartScreen
