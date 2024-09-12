import { FC, useCallback, useContext, useEffect, useState } from "react"
import { Workspace } from "../../api-client"
import { Box, Button, ListItem, ListItemText, Typography } from "@mui/material"
import { DockerClientContext } from "../../contexts/DockerClientContext"

const WorkspaceItem: FC<{workspace: Workspace}> = ({workspace}) => {
  const client = useContext(DockerClientContext)
  const [workspacePath, setWorkspacePath] = useState<string | null>(null)

  const isWorkspaceRunning = (workspace: Workspace) => {
    return workspace.projects[0].state && workspace.projects[0].state.uptime > 0
  }

  useEffect(() => {    
      getCodePath(workspace)    
  }, [workspace])


  const getCodePath = useCallback(async (data: Workspace) => {          
    try {
      await new Promise<void>((resolve, reject) => {
        const result = client?.extension.host?.cli.exec(
          'daytona',
          ['ssh', data.id, data.name, "echo $HOME"],
          {
            stream: {
              onOutput: (message: any) => {                                                                 
                
                try {                                    
                  setWorkspacePath(message.stdout.trim())               
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
      console.log(error, '-------');      
    }
  }, [client])
  

  return (
    <ListItem divider>
      <Box display={'flex'} alignItems="center" gap={2} justifyContent="space-between" width={'100%'}>
        <Box display={'flex'} alignItems="center" gap={3}>
          <ListItemText>
            <Typography variant="subtitle2">{workspace.name}</Typography>  
          </ListItemText>          
          <ListItemText secondary={workspace.projects[0].repository.url} />          
          <Typography color={isWorkspaceRunning(workspace) ? 'success.main' : 'error'}>{isWorkspaceRunning(workspace) ? 'Running' : 'Stopped'}</Typography>                        
        </Box>
        {workspacePath && (
          <a href={`vscode://vscode-remote/ssh-remote+default-${workspace.id}-${workspace.name}${workspacePath}/${workspace.name}`}>
            <Button size="small" variant="contained">Open in VS code</Button>
          </a>
        )

        }
      </Box>
    </ListItem>        
  )
}

export default WorkspaceItem
    