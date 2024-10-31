import {
  Button,
  ButtonGroup,
  ListItemText,
  ListItemIcon,
  Tooltip,
} from '@mui/material'
import { FC, useRef, useState } from 'react'
import ArrowDropDownIcon from '@mui/icons-material/ArrowDropDown'
import ClickAwayListener from '@mui/material/ClickAwayListener'
import Grow from '@mui/material/Grow'
import Paper from '@mui/material/Paper'
import Popper from '@mui/material/Popper'
import MenuItem from '@mui/material/MenuItem'
import MenuList from '@mui/material/MenuList'

import { Editor, EDITORS } from '../../../constants/editors'

interface Props {
  onSelect: (editor: Editor) => void
  editor?: Editor
}

const OpenInEditorButton: FC<Props> = ({
  onSelect,
  editor = Editor.Vscode,
}) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [selectedEditor, setSelectedEditor] = useState<Editor>(editor)

  const handleMenuItemClick = (editor: Editor) => {
    setSelectedEditor(editor)
    onSelect(editor)
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
        <Tooltip title="Open in Editor">
          <Button
            sx={{
              justifyContent: 'space-between',
              textTransform: 'uppercase',
              textAlign: 'center',
              borderRight: 'transparent !important',
            }}
            startIcon={EDITORS[selectedEditor].icon}
            size="small"
            variant="outlined"
            onClick={() => onSelect(selectedEditor)}
          />
        </Tooltip>
        <Button
          aria-controls={open ? 'split-button-menu' : undefined}
          aria-expanded={open ? 'true' : undefined}
          aria-label="select merge strategy"
          aria-haspopup="menu"
          variant="outlined"
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
                  {Object.values(Editor)
                    .filter((editor) => editor !== selectedEditor)
                    .map((editor) => (
                      <MenuItem
                        key={editor}
                        selected={editor === selectedEditor}
                        onClick={() => handleMenuItemClick(editor as Editor)}
                      >
                        <ListItemIcon>
                          {EDITORS[editor as Editor].icon}
                        </ListItemIcon>
                        <ListItemText>
                          {EDITORS[editor as Editor].label}
                        </ListItemText>
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
