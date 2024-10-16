import { useEffect, useState } from 'react'
import {
  Autocomplete,
  Box,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  Typography,
  Select,
  MenuItem,
  FormControl,
  FormHelperText,
  CircularProgress,
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'
import { useXTerm } from 'react-xtermjs'
import { AxiosResponse } from 'axios'

import Header from './shared/Header'
import {
  GitProvider,
  GitRepository,
  ProviderTarget,
  WorkspaceDTO,
} from '../api-client'
import { useApiClient } from '../providers/ApiClientProvider'
import { useDockerClient } from '../providers/DockerClientProvider'
import { useDaytonaConfig } from '../providers/DaytonaConfigProvider'
import WorkspaceList from './shared/WorkspaceList'
import { Editor, EDITORS } from '../constants/editors'

const steps = ['Setup', 'Preparing', 'Ready']

const CreateWorkspace = () => {
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useNavigate()
  const client = useDockerClient()
  const { daytonaConfig } = useDaytonaConfig()
  const { instance, ref } = useXTerm()
  const [isError, setIsError] = useState(false)
  const [createdWorkspaceId, setCreatedWorkspaceId] = useState<string | null>(
    null,
  )
  const [workspace, setWorkspace] = useState<WorkspaceDTO | null>(null)
  const [targets, setTargets] = useState<ProviderTarget[]>([])
  const { workspaceApiClient, targetApiClient, gitProvidersApiClient } =
    useApiClient()
  const [repos, setRepos] = useState<GitRepository[]>([])
  const [loadingRepos, setLoadingRepos] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { isValid },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      repo: '',
      editor: daytonaConfig?.defaultIde || Editor.Vscode,
      target: '',
    },
  })

  const selectedEditor = watch('editor')

  useEffect(() => {
    if (gitProvidersApiClient) {
      setLoadingRepos(true)
      gitProvidersApiClient
        .listGitProviders()
        .then(async (response: AxiosResponse<GitProvider[], any>) => {
          const list = []

          try {
            for (const p of response.data) {
              const response = await gitProvidersApiClient.getNamespaces(p.id)
              for (const n of response.data) {
                const response = await gitProvidersApiClient.getRepositories(
                  p.id,
                  n.id,
                )
                if (!response || !response.data) {
                  continue
                }
                list.push(...response.data)
              }
            }
          } catch (error) {
            client?.desktopUI.toast.error(
              `Error while fetching repos. ${error}`,
            )
          }

          setRepos(list)
          setLoadingRepos(false)
        })
        .catch((e) => {
          setLoadingRepos(false)
          console.error(e)
        })
    }
  }, [gitProvidersApiClient])

  useEffect(() => {
    if (targetApiClient) {
      targetApiClient
        .listTargets()
        .then((response: AxiosResponse<ProviderTarget[], any>) => {
          if (response.data.length > 0) {
            setTargets(response.data)
            setValue('target', response.data[0].name)
          }
        })
        .catch((error: any) => {
          console.log(error)
        })
    }
  }, [targetApiClient])

  const openInEditor = async (
    createdWorkspaceId: string,
    createdWorkspaceName: string,
    editor: Editor,
  ) => {
    try {
      await new Promise<void>((resolve, reject) => {
        let stderr = ''

        client?.extension.host?.cli.exec(
          'daytona',
          ['code', createdWorkspaceId, createdWorkspaceName, '--ide', editor],
          {
            stream: {
              onOutput: (message: any) => {
                if (message.stderr) {
                  stderr += message.stderr
                }
              },
              onClose: () => resolve(),
              onError: (error: any) => {
                if (!error) {
                  resolve()
                  return
                }

                client?.desktopUI.toast.error(
                  `Error with opening editor. ERROR: ${JSON.stringify(
                    error,
                  )} ${stderr}`,
                )
                reject(error)
              },
            },
          },
        )
      })
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (createdWorkspaceId && activeStep === 2 && workspaceApiClient) {
      workspaceApiClient
        .getWorkspace(createdWorkspaceId)
        .then(async (response: AxiosResponse<WorkspaceDTO, any>) => {
          await openInEditor(
            createdWorkspaceId,
            response.data.name,
            selectedEditor as Editor,
          )
          setWorkspace(response.data)
        })
        .catch((error: any) => {
          console.log(error)
        })
    }
  }, [createdWorkspaceId, activeStep, workspaceApiClient])

  const onSubmit = async (data: any) => {
    try {
      await new Promise<void>((resolve, reject) => {
        const result = client?.extension.host?.cli.exec(
          'daytona',
          ['create', data.repo, '-t', data.target, '--no-ide'],
          {
            stream: {
              onOutput: (message: any) => {
                if (message.stdout) {
                  const workspaceIdRegex = /ID\s+([a-f0-9]+)/
                  const match = message.stdout.match(workspaceIdRegex)

                  if (match) {
                    const workspaceId = match[1]
                    setCreatedWorkspaceId(workspaceId)
                  }
                }

                if (message.stderr) {
                  instance?.write(message.stderr)
                  reject(message.stderr)
                }

                try {
                  instance?.write(message.stdout)
                } catch (error) {
                  reject(error)
                }
              },
              onClose: () => resolve(),
              onError: (error: any) => reject(error),
            },
          },
        )
      })
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    } catch (error) {
      setIsError(true)
    }
  }

  const handleNext = () => {
    if (activeStep === 0) {
      handleSubmit(onSubmit)()
      if (isValid) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
      }
    }

    if (activeStep === 1) {
      setActiveStep((prevActiveStep) => prevActiveStep + 1)
    }
  }

  useEffect(() => {
    if (activeStep === steps.length) {
      navigate('/')
    }
  }, [activeStep])

  const validateURL = (value: string) => {
    try {
      new URL(value)
      return true
    } catch (_) {
      return 'Please enter a valid URL'
    }
  }

  const handleDelete = () => {
    if (workspaceApiClient) {
      workspaceApiClient
        .removeWorkspace(createdWorkspaceId as string, true)
        .then(() => {
          navigate('/')
        })
        .catch((error: any) => {
          console.log(error)
        })
    }
  }

  return (
    <Box>
      <Header />
      <Box display="flex" flexDirection="column" alignItems="center" py={4}>
        <Box width="100%">
          <Box px={4}>
            <Stepper activeStep={activeStep}>
              {steps.map((label, index) => {
                const stepProps: { completed?: boolean } = {}
                return (
                  <Step key={label} {...stepProps}>
                    <StepLabel>{label}</StepLabel>
                  </Step>
                )
              })}
            </Stepper>
          </Box>
          <Box mt={8} px={8}>
            {activeStep === 0 && (
              <Box mt={2} display="flex" flexDirection="column" gap={2}>
                <Typography variant="h2" textAlign="center" mb={2}>
                  Create Workspace
                </Typography>
                {targets.length > 0 ? (
                  <>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="body1">
                        Choose source (Browse your repos, select a predefined
                        sample, or find with URL)
                      </Typography>
                      <Controller
                        name="repo"
                        control={control}
                        rules={{
                          required: 'This field is required',
                          validate: validateURL,
                        }}
                        render={({ field, fieldState: { error } }) => (
                          <Autocomplete
                            freeSolo
                            options={repos.map((repo) => repo.url)}
                            loading={loadingRepos}
                            onChange={(_, value) => {
                              field.onChange(value)
                            }}
                            renderInput={(params) => (
                              <TextField
                                error={!!error}
                                helperText={error?.message}
                                placeholder="https://..., git@..."
                                {...params}
                                {...field}
                                InputProps={{
                                  ...params.InputProps,
                                  endAdornment: (
                                    <>
                                      {loadingRepos ? (
                                        <CircularProgress
                                          color="inherit"
                                          size={20}
                                        />
                                      ) : null}
                                      {params.InputProps.endAdornment}
                                    </>
                                  ),
                                }}
                              />
                            )}
                          />
                        )}
                      />
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="body1">Choose IDE</Typography>
                      <Controller
                        name="editor"
                        control={control}
                        rules={{ required: 'This field is required' }}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl error={!!error}>
                            <Select
                              {...field}
                              renderValue={(value) =>
                                EDITORS[value as Editor].label
                              }
                            >
                              {Object.values(Editor).map((editor) => (
                                <MenuItem
                                  key={editor}
                                  value={editor}
                                  sx={{ display: 'flex', gap: 1 }}
                                >
                                  {EDITORS[editor as Editor].icon}
                                  {EDITORS[editor as Editor].label}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>{error?.message}</FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Box>
                    <Box display="flex" flexDirection="column" gap={1}>
                      <Typography variant="body1">Choose Target</Typography>
                      <Controller
                        name="target"
                        control={control}
                        rules={{ required: 'This field is required' }}
                        render={({ field, fieldState: { error } }) => (
                          <FormControl error={!!error}>
                            <Select {...field}>
                              {targets.map((target) => (
                                <MenuItem key={target.name} value={target.name}>
                                  {target.name}
                                </MenuItem>
                              ))}
                            </Select>
                            <FormHelperText>{error?.message}</FormHelperText>
                          </FormControl>
                        )}
                      />
                    </Box>
                  </>
                ) : (
                  <Typography variant="body1" textAlign="center" mb={2}>
                    Please set up a target to create a workspace
                  </Typography>
                )}
              </Box>
            )}

            <Box
              alignItems="center"
              display="flex"
              flexDirection="column"
              gap={2}
            >
              {activeStep === 1 && (
                <>
                  {isError ? (
                    <Typography variant="h3" color="error">
                      Error while creating workspace
                    </Typography>
                  ) : (
                    <>
                      <CircularProgress />
                      <Typography variant="h3">
                        Setting up your workspace
                      </Typography>
                    </>
                  )}
                </>
              )}
              <Box ref={ref} width={'100%'} hidden={activeStep !== 1} />
            </Box>

            {activeStep === 2 && (
              <>
                <Box
                  mt={2}
                  px={8}
                  alignItems="center"
                  display="flex"
                  flexDirection="column"
                >
                  <Typography variant="h3">You are all set</Typography>
                  <Typography variant="body1">
                    You can open your favorite IDE and start coding
                  </Typography>
                </Box>
                {workspace ? (
                  <Box mt={4}>
                    <WorkspaceList
                      workspaces={[workspace]}
                      onDelete={handleDelete}
                      preferedEditor={selectedEditor as Editor}
                    />
                  </Box>
                ) : (
                  <Box
                    alignItems="center"
                    display="flex"
                    flexDirection="column"
                    gap={2}
                    mt={4}
                  >
                    <CircularProgress />
                    <Typography variant="h3">Opening workspace</Typography>
                    {selectedEditor === Editor.Jupyter && (
                      <Typography variant="body1">Forwarding port</Typography>
                    )}
                  </Box>
                )}
              </>
            )}
          </Box>

          {activeStep === 0 && targets.length > 0 && (
            <Box display="flex" flexDirection="row" pt={2} px={8}>
              <Box sx={{ flex: '1 1 auto' }} />
              <Button onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  )
}

export default CreateWorkspace
