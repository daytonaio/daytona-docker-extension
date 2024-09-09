import { useContext, useEffect, useState } from 'react'
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material'

import Header from './shared/Header'
import { ReactComponent as Logo } from '../assets/logo.svg'
import { Workspace } from '../api-client'
import { ApiClientContext } from '../contexts/ApiClientContext'

const mockedWorkspaces: any[] = [
  {
    "id": "4dc34b469499",
    "name": "tpuljak",
    "projects": [
      {
        "buildConfig": {},
        "envVars": null,
        "image": "daytonaio/workspace-project:latest",
        "name": "tpuljak",
        "repository": {
          "branch": "main",
          "cloneTarget": "branch",
          "id": "tpuljak",
          "name": "tpuljak",
          "owner": "tpuljak",
          "sha": "9331cd5642da2557220ebf10c9ff092d70bbb69c",
          "source": "github.com",
          "url": "https://github.com/tpuljak/tpuljak.git"
        },
        "state": {
          "gitStatus": {
            "currentBranch": "main",
            "fileStatus": null
          },
          "updatedAt": "Sat, 31 Aug 2024 16:10:38 CEST",
          "uptime": 3857
        },
        "target": "local",
        "user": "daytona",
        "workspaceId": "4dc34b469499"
      }
    ],
    "target": "local"
  },
  {
    "id": "718bde909385",
    "name": "testrepo",
    "projects": [
      {
        "buildConfig": {},
        "envVars": null,
        "image": "daytonaio/workspace-project:latest",
        "name": "testrepo",
        "repository": {
          "branch": "main",
          "cloneTarget": "branch",
          "id": "testrepo",
          "name": "testrepo",
          "owner": "Swearengen",
          "sha": "943323d646127a8b6e6e97c79cf9d9e064d27a87",
          "source": "github.com",
          "url": "https://github.com/swearengen/testrepo.git"
        },
        "target": "local",
        "user": "daytona",
        "workspaceId": "718bde909385"
      }
    ],
    "target": "local"
  },
  {
    "id": "4a82347a9137",
    "name": "testrepo2",
    "projects": [
      {
        "buildConfig": {},
        "envVars": null,
        "image": "daytonaio/workspace-project:latest",
        "name": "testrepo",
        "repository": {
          "branch": "main",
          "cloneTarget": "branch",
          "id": "testrepo",
          "name": "testrepo",
          "owner": "Swearengen",
          "sha": "943323d646127a8b6e6e97c79cf9d9e064d27a87",
          "source": "github.com",
          "url": "https://github.com/swearengen/testrepo.git"
        },
        "target": "local",
        "user": "daytona",
        "workspaceId": "4a82347a9137"
      }
    ],
    "target": "local"
  }
];

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
        setWorkspaces(mockedWorkspaces)
      })
    }
  }, [apiClient])

  const isWorkspaceRunning = (workspace: Workspace) => {
    return workspace.projects[0].state && workspace.projects[0].state.uptime > 0
  }
  
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

      {workspaces.length > 0 && (
        <List sx={{
          width: '100%',
          p: 4
        }} aria-label="mailbox folders">        
          {workspaces.map((workspace: Workspace) => (
            <ListItem key={workspace.id} divider>
            <Box display={'flex'} alignItems="center" gap={2} justifyContent="space-between" width={'100%'}>
              <Box display={'flex'} alignItems="center" gap={3}>
                <ListItemText>
                  <Typography variant="subtitle2">{workspace.name}</Typography>  
                </ListItemText>          
                <ListItemText secondary={workspace.projects[0].repository.url} />          
                <Typography color={isWorkspaceRunning(workspace) ? 'success.main' : 'error'}>{isWorkspaceRunning(workspace) ? 'Running' : 'Stopped'}</Typography>                        
              </Box>
              <Button size="small" variant="contained">Open in VS code</Button>
            </Box>
          </ListItem>        
          ))}
        </List>
      )

      }
    </Box>
  )
}

export default StartScreen
