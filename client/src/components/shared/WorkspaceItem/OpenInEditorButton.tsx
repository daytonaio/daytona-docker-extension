import { Box, Button, ButtonGroup, CircularProgress } from '@mui/material'
import { FC, useRef, useState } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'

import VsCodeIcon from '../icons/VsCodeIcon'
import Editor from '../../../enums/editor'

interface Props {
  onSelect: (editor: string) => void
  isLoading: boolean
  editor?: string
}

const options = Object.keys(Editor).map((e) => ({
  value: e,
  label: Editor[e as keyof typeof Editor],
}))

const OpenInEditorButton: FC<Props> = ({
  onSelect,
  isLoading,
  editor = 'vscode',
}) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [selectedEditor, setSelectedEditor] = useState(editor)

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    editor: string,
  ) => {
    setSelectedEditor(editor)
    setOpen(false)
  }

  const handleToggle = () => {
    setOpen((prevOpen) => !prevOpen)
  }

  const handleClose = (event: Event) => {
    if (
      anchorRef.current &&
      anchorRef.current.contains(event.target as HTMLElement)
    ) {
      return
    }

    setOpen(false)
  }

  return (
    <>
      <ButtonGroup
        variant="contained"
        ref={anchorRef}
        aria-label="Button group with a nested menu"
      >
        <Button
          sx={{
            width: 120,
            justifyContent: 'space-between',
            textTransform: 'uppercase',
            textAlign: 'center',
          }}
          startIcon={
            isLoading ? (
              <CircularProgress size="16px" color="info" />
            ) : (
              <VsCodeIcon />
            )
          }
          size="small"
          variant="contained"
          onClick={() => onSelect(selectedEditor)}
        >
          <Box flex={1}>{selectedEditor}</Box>
        </Button>
        <Button
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          onClick={handleToggle}
        >
          <ArrowDropDownIcon />
        </Button>
      </ButtonGroup>
      <Popper
        sx={{ zIndex: 1 }}
        open={open}
        anchorEl={anchorRef.current}
        role={undefined}
        transition
        disablePortal
      >
        {({ TransitionProps, placement }) => (
          <Grow
            {...TransitionProps}
            style={{
              transformOrigin:
                placement === 'bottom' ? 'center top' : 'center bottom',
            }}
          >
            <Paper>
              <ClickAwayListener onClickAway={handleClose}>
                <MenuList id="split-button-menu" autoFocusItem>
                  {options.map((option) => (
                    <MenuItem
                      key={option.value}
                      selected={option.value === selectedEditor}
                      onClick={(event) =>
                        handleMenuItemClick(event, option.value)
                      }
                    >
                      {option.label}
                    </MenuItem>
                  ))}
                </MenuList>
              </ClickAwayListener>
            </Paper>
          </Grow>
        )}
      </Popper>
    </>
  )
}

export default OpenInEditorButton
