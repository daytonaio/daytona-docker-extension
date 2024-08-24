import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import { App } from './App';
import { createDockerDesktopClient } from '@docker/extension-api-client';

import { DockerClientContext } from './contexts/DockerClientContext';

const client = createDockerDesktopClient();

ReactDOM.render(
  <React.StrictMode>
    <DockerClientContext.Provider value={client}>
      <DockerMuiThemeProvider>
        <CssBaseline />
        <App />
      </DockerMuiThemeProvider>
      </DockerClientContext.Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
