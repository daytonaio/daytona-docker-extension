import { useEffect, useState } from 'react';
import { Box, Grid, LinearProgress, Typography, useTheme } from '@mui/material';
import { createDockerDesktopClient } from '@docker/extension-api-client';
import { Link } from 'react-router-dom';
import StartScreen from './components/StartScreen';
import {
  createMemoryRouter,
  RouterProvider,
} from "react-router-dom";
import CreateWorkspace from './components/CreateWorkspace';

const router = createMemoryRouter([
  {
    path: "/",
    element: <StartScreen />,
  }, {
    path: "/create",
    element: <CreateWorkspace />
  }
]);


const client = createDockerDesktopClient();

export function App() {
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(false);  
  const theme = useTheme();

  useEffect(() => {
    let timer: number;

    const start = async () => {
      setReady(() => false);

      let colors = {
        background: theme.palette.background.default,
        foreground: theme.palette.text.primary,
        cursor: theme.palette.docker.grey[800],
        selection: theme.palette.primary.light,
      };
      await client.extension.vm?.service?.post('/start', colors);
    };

    start().then(() => {
      let retries = 60;
      let timer = setInterval(async () => {

        if (retries == 0) {
          clearInterval(timer);
          setUnavailable(true);
        }

        try {
          const result = await client.extension.vm?.service?.get('/ready');

          if (Boolean(result)) {
            setReady(() => true);
            clearInterval(timer);
          }
        } catch (error) {
          console.log('error when checking Daytona status', error);
          retries--;
        }
      }, 1000);
    }).catch(error => {
      console.log('failed to start Daytona', error);
      client.desktopUI.toast.error(error);
      setUnavailable(true);
    })

    return () => {
      clearInterval(timer);
    };
  }, [theme]);

  return (
    <>
      {unavailable && (
        <Grid container flex={1} direction="column" padding="16px 32px" height="100%" justifyContent="center" alignItems="center">
          <Grid item>
            Daytona failed to start, please close the extension and reopen to try again.
          </Grid>
        </Grid>
      )}
      {!ready && (
        <Grid container flex={1} direction="column" padding="16px 32px" height="100%" justifyContent="center" alignItems="center">
          <Grid item>
            <LinearProgress/>
            <Typography mt={2}>
              Waiting for Daytona to be ready. It may take some seconds if
              it's the first time.
            </Typography>
          </Grid>
        </Grid>
      )}
      {ready && (
        <RouterProvider router={router} />
      )}
    </>
  );
}
