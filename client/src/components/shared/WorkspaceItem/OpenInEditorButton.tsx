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
import { Editor, EDITORS } from '../../../constants/editors'

interface Props {
  onSelect: (editor: Editor) => void
  isLoading: boolean
  editor?: Editor
}

const OpenInEditorButton: FC<Props> = ({
  onSelect,
  isLoading,
  editor = Editor.vscode,
}) => {
  const [open, setOpen] = useState(false)
  const anchorRef = useRef<HTMLDivElement>(null)
  const [selectedEditor, setSelectedEditor] = useState<Editor>(editor)

  const handleMenuItemClick = (
    event: React.MouseEvent<HTMLLIElement, MouseEvent>,
    editor: Editor,
  ) => {
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
          <Box flex={1}>{EDITORS[selectedEditor].label}</Box>
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
                  {Object.values(Editor)
                    .filter((editor) => editor !== selectedEditor)
                    .map((editor) => (
                      <MenuItem
                        key={editor}
                        selected={editor === selectedEditor}
                        onClick={(event) =>
                          handleMenuItemClick(event, editor as Editor)
                        }
                      >
                        {EDITORS[editor as Editor].label}
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
