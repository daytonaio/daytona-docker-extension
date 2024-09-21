import {
  Stack,
  Typography,
  Box,
  Button,
  IconButton,
  Menu,
  MenuItem,
} from '@mui/material'
import ChevronLeft from '@mui/icons-material/ChevronLeft'
import { Link, useLocation } from 'react-router-dom'
import { useMemo, useState } from 'react'
import { useDaytonaConfig } from '../../providers/DaytonaConfigProvider'
import { useDockerClient } from '../../providers/DockerClientProvider'

const Header = () => {
  const location = useLocation()
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { daytonaConfig, loadDaytonaConfig } = useDaytonaConfig()
  const dockerClient = useDockerClient()

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const handleClose = async (profileName: string) => {
    setAnchorEl(null)
    try {
      await dockerClient?.extension.host?.cli.exec('daytona', [
        'profile',
        'use',
        profileName,
      ])
      loadDaytonaConfig()
    } catch (error) {
      console.log(error)
      dockerClient?.desktopUI.toast.error('Failed to switch profile')
    }
  }

  const profiles = useMemo(() => {
    return daytonaConfig?.profiles.filter(
      (profile) => profile.name !== daytonaConfig?.activeProfile,
    )
  }, [daytonaConfig])

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
      <Box display="flex" gap={2} alignItems={'center'}>
        <Typography>Active profile</Typography>
        <Box>
          <Button
            disabled={location.pathname === '/create'}
            variant="outlined"
            onClick={handleClick}
            size="small"
          >
            {daytonaConfig?.activeProfile}
          </Button>
          {profiles && profiles.length > 0 && (
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={handleClose}
              MenuListProps={{
                'aria-labelledby': 'basic-button',
              }}
            >
              {profiles.map((profile) => (
                <MenuItem
                  key={profile.name}
                  onClick={() => handleClose(profile.name)}
                >
                  {profile.name}
                </MenuItem>
              ))}
            </Menu>
          )}
        </Box>
      </Box>
    </Stack>
  )
}

export default Header
