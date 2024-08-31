import { useContext, useEffect, useState } from 'react'
import { Box, Typography, List, ListItem, ListItemText, Divider, Button } from '@mui/material'

import Header from './shared/Header'
import { ReactComponent as Logo } from '../assets/logo.svg'
import { Workspace } from '../api-client'
import { ApiClientContext } from '../contexts/ApiClientContext'

const StartScreen = () => {
  const apiClient = useContext(ApiClientContext)
  const [workspaces, setWorkspaces] = useState<Array<Workspace>>([])

  useEffect(() => {
    if (apiClient) {
      apiClient.listWorkspaces().then((response: any) => {
        setWorkspaces(response.data)
      }).catch((error: any) => {
        console.log(error, '-------');
      })
    }
  }, [apiClient])

  console.log(workspaces, '-------');
  
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Header />

      <Box display="flex" flexDirection="column" alignItems="center" pt={4}>
        <Logo width={60} height={60} />
        <Typography mt={4} variant="h6" textAlign={'center'}>
          The Open Source Development Environment Manager <br />
          Set up a development environment on any infrastructure, with a single
          click
        </Typography>
      </Box>

      <List sx={{
        width: '100%',
        p: 4
      }} aria-label="mailbox folders">
        <ListItem divider>
          <Box display={'flex'} alignItems="center" gap={2} justifyContent="space-between" width={'100%'}>
            <Box display={'flex'} alignItems="center" gap={3}>
              <ListItemText>
                <Typography variant="subtitle2">Workspace name</Typography>  
              </ListItemText>          
              <ListItemText secondary="repo url" />          
              <Typography color="success.main">Runing</Typography>                        
            </Box>
            <Button size="small" variant="contained">Open in VS code</Button>
          </Box>
        </ListItem>        
        <ListItem divider>
          <Box display={'flex'} alignItems="center" gap={2} justifyContent="space-between" width={'100%'}>
            <Box display={'flex'} alignItems="center" gap={3}>
              <ListItemText>
                <Typography variant="subtitle2">Workspace name</Typography>  
              </ListItemText>          
              <ListItemText secondary="repo url" />          
              <Typography color="error">Stopped</Typography>                        
            </Box>
            <Button size="small" variant="contained">Open in VS code</Button>
          </Box>
        </ListItem>        
      </List>
    </Box>
  )
}

export default StartScreen
