export enum Editor {
  vscode = 'vscode',
  browser = 'browser',
  cursor = 'cursor',
  jupyter = 'jupyter',
  fleet = 'fleet',
}

export const EDITORS: Record<Editor, { value: Editor; label: string }> = {
  [Editor.vscode]: {
    value: Editor.vscode,
    label: 'VS Code',
  },
  [Editor.browser]: {
    value: Editor.browser,
    label: 'Browser',
  },
  [Editor.cursor]: {
    value: Editor.cursor,
    label: 'Cursor',
  },
  [Editor.jupyter]: {
    value: Editor.jupyter,
    label: 'Jupyter',
  },
  [Editor.fleet]: {
    value: Editor.fleet,
    label: 'Fleet',
  },
}
