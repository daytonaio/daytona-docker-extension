import React from 'react';
import ReactDOM from 'react-dom';
import CssBaseline from '@mui/material/CssBaseline';
import { DockerMuiThemeProvider } from '@docker/docker-mui-theme';
import {
  createMemoryRouter,
  RouterProvider,
} from "react-router-dom";
import { App } from './App';
import CreateWorkspace from './components/CreateWorkspace';

const router = createMemoryRouter([
  {
    path: "/",
    element: <App />,
  }, {
    path: "/create",
    element: <CreateWorkspace />
  }
]);

ReactDOM.render(
  <React.StrictMode>
    <DockerMuiThemeProvider>
      <CssBaseline />
      <RouterProvider router={router} />
    </DockerMuiThemeProvider>
  </React.StrictMode>,
  document.getElementById('root'),
);
