import { Stack, Typography, Box, Button, IconButton } from '@mui/material'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import { Link, useLocation } from 'react-router-dom'

import SwitchProfile from './SwitchProfile'

const Header = () => {
  const location = useLocation()

  return (
    <Stack
      width="100%"
      direction="row"
      justifyContent="space-between"
      alignItems="center"
      spacing={2}
      padding={2}
    >
      <Box display="flex" gap={4}>
        <Box display="flex" alignItems="center" gap={2}>
          {location.pathname === '/create' && (
            <Link to="/">
              <IconButton size="small">
                <ChevronLeft fontSize="small" />
              </IconButton>
            </Link>
          )}
          <Typography variant="h2">Daytona</Typography>
        </Box>
        {location.pathname === '/' && (
          <Link to="/create">
            <Button size="small" variant="contained">
              Create Workspace
            </Button>
          </Link>
        )}
      </Box>
      <SwitchProfile disabled={location.pathname === '/create'} />
    </Stack>
  )
}

export default Header
