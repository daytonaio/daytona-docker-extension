import { FC } from "react"
import { Workspace } from "../../api-client"
import { Box, Button, ListItem, ListItemText, Typography } from "@mui/material"

const WorkspaceItem: FC<{workspace: Workspace}> = ({workspace}) => {

  const isWorkspaceRunning = (workspace: Workspace) => {
    return workspace.projects[0].state && workspace.projects[0].state.uptime > 0
  }

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
        <Button size="small" variant="contained">Open in VS code</Button>
      </Box>
    </ListItem>        
  )
}

export default WorkspaceItem
    