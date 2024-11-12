import { Box, Button, Menu, MenuItem, Typography } from '@mui/material'
import { useState, useMemo } from 'react'

import { useDaytonaConfig } from '../../providers/DaytonaConfigProvider'
import { useDockerClient } from '../../providers/DockerClientProvider'

const SwitchProfile = ({ disabled }: { disabled?: boolean }) => {
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null)
  const { daytonaConfig, loadDaytonaConfig } = useDaytonaConfig()
  const dockerClient = useDockerClient()

  const open = Boolean(anchorEl)
  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget)
  }
  const onItemClick = async (profileName: string) => {
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
    return daytonaConfig?.profiles?.filter(
      (profile) => profile.name !== daytonaConfig?.activeProfile,
    )
  }, [daytonaConfig])

  return (
    <Box display="flex" gap={2} alignItems={'center'}>
      <Typography>Active profile</Typography>
      <Box>
        <Button
          disabled={disabled}
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
            onClose={() => setAnchorEl(null)}
            MenuListProps={{
              'aria-labelledby': 'basic-button',
            }}
          >
            {profiles.map((profile) => (
              <MenuItem
                key={profile.name}
                onClick={() => onItemClick(profile.name)}
              >
                {profile.name}
              </MenuItem>
            ))}
          </Menu>
        )}
      </Box>
    </Box>
  )
}

export default SwitchProfile
