import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import axios from 'axios';

import { Configuration, WorkspaceApi } from './api-client'
import { App } from './App';
import { DockerClientContext } from './contexts/DockerClientContext';
import { ApiClientContext } from './contexts/ApiClientContext';

const client = createDockerDesktopClient();

const axiosInstance = axios.create()
// axiosInstance.defaults.headers.common['Authorization'] = `Bearer ${key}`

const api = new WorkspaceApi(new Configuration({
  basePath: 'https://api-da4ba56e-c370-4ce5-95db-7e0de1f4a95b.try-eu.daytona.app'
}), undefined, axiosInstance)

ReactDOM.render(
  <React.StrictMode>
    <DockerClientContext.Provider value={client}>
      <ApiClientContext.Provider value={api}>
        <DockerMuiThemeProvider>
          <CssBaseline />
          <App />
        </DockerMuiThemeProvider>
      </ApiClientContext.Provider>
      </DockerClientContext.Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);
