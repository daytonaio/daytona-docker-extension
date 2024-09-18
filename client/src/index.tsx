import React from 'react'
import ReactDOM from 'react-dom'
import CssBaseline from '@mui/material/CssBaseline'
import { DockerMuiThemeProvider } from '@docker/docker-mui-theme'

import { App } from './App'
import { DaytonaConfigProvider } from './providers/DaytonaConfigProvider'
import { ApiClientProvider } from './providers/ApiClientProvider'
import { DockerClientProvider } from './providers/DockerClientProvider'

ReactDOM.render(
  <React.StrictMode>
    <DockerClientProvider>
      <DaytonaConfigProvider>
        <ApiClientProvider>
          <DockerMuiThemeProvider>
            <CssBaseline />
            <App />
          </DockerMuiThemeProvider>
        </ApiClientProvider>
      </DaytonaConfigProvider>
    </DockerClientProvider>
  </React.StrictMode>,
  document.getElementById('root'),
)
