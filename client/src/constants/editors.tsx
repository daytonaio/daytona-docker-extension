import VsCodeIcon from '../components/shared/icons/VsCodeIcon'
import VsCodeBrowserIcon from '../components/shared/icons/VsCodeBrowserIcon'
import CursorIcon from '../components/shared/icons/CursorIcon'
import JupyterIcon from '../components/shared/icons/JupyterIcon'
import FleetIcon from '../components/shared/icons/FleetIcon'
import CLionIcon from '../components/shared/icons/CLionIcon'
import IntelliJIcon from '../components/shared/icons/IntelliJIcon'
import GoLandIcon from '../components/shared/icons/GoLandIcon'
import PyCharmIcon from '../components/shared/icons/PyCharmIcon'
import PhpStormIcon from '../components/shared/icons/PhpStormIcon'
import WebStormIcon from '../components/shared/icons/WebStormIcon'
import RiderIcon from '../components/shared/icons/RiderIcon'
import RubyMineIcon from '../components/shared/icons/RubyMineIcon'

export enum Editor {
  Vscode = 'vscode',
  VsCodeBrowser = 'browser',
  Cursor = 'cursor',
  Jupyter = 'jupyter',
  Fleet = 'fleet',
  CLion = 'clion',
  IntelliJ = 'intellij',
  GoLand = 'goland',
  PyCharm = 'pycharm',
  PhpStorm = 'phpstorm',
  WebStorm = 'webstorm',
  Rider = 'rider',
  RubyMine = 'rubymine',
}

export const EDITORS: Record<
  Editor,
  { value: Editor; label: string; icon?: JSX.Element }
> = {
  [Editor.Vscode]: {
    value: Editor.Vscode,
    label: 'VS Code',
    icon: <VsCodeIcon />,
  },
  [Editor.VsCodeBrowser]: {
    value: Editor.VsCodeBrowser,
    label: 'Browser',
    icon: <VsCodeBrowserIcon />,
  },
  [Editor.Cursor]: {
    value: Editor.Cursor,
    label: 'Cursor',
    icon: <CursorIcon />,
  },
  [Editor.Jupyter]: {
    value: Editor.Jupyter,
    label: 'Jupyter',
    icon: <JupyterIcon />,
  },
  [Editor.Fleet]: {
    value: Editor.Fleet,
    label: 'Fleet',
    icon: <FleetIcon />,
  },
  [Editor.CLion]: {
    value: Editor.CLion,
    label: 'CLion',
    icon: <CLionIcon />,
  },
  [Editor.IntelliJ]: {
    value: Editor.IntelliJ,
    label: 'IntelliJ',
    icon: <IntelliJIcon />,
  },
  [Editor.GoLand]: {
    value: Editor.GoLand,
    label: 'GoLand',
    icon: <GoLandIcon />,
  },
  [Editor.PyCharm]: {
    value: Editor.PyCharm,
    label: 'PyCharm',
    icon: <PyCharmIcon />,
  },
  [Editor.PhpStorm]: {
    value: Editor.PhpStorm,
    label: 'PhpStorm',
    icon: <PhpStormIcon />,
  },
  [Editor.WebStorm]: {
    value: Editor.WebStorm,
    label: 'WebStorm',
    icon: <WebStormIcon />,
  },
  [Editor.Rider]: {
    value: Editor.Rider,
    label: 'Rider',
    icon: <RiderIcon />,
  },
  [Editor.RubyMine]: {
    value: Editor.RubyMine,
    label: 'RubyMine',
    icon: <RubyMineIcon />,
  },
}
