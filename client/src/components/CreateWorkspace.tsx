import { useEffect, useMemo, useRef, useState } from 'react'
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
import { FitAddon } from '@xterm/addon-fit'

import Header from './shared/Header'
import {
  GitProvider,
  GitRepository,
  Sample,
  TargetDTO,
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
  const fitAddon = useRef(new FitAddon())
  const { instance, ref } = useXTerm()
  const [isError, setIsError] = useState(false)
  const [createdWorkspaceId, setCreatedWorkspaceId] = useState<string | null>(
    null,
  )
  const [workspace, setWorkspace] = useState<WorkspaceDTO | null>(null)
  const [targets, setTargets] = useState<TargetDTO[]>([])
  const [samples, setSamples] = useState<Sample[]>([])
  const {
    workspaceApiClient,
    targetApiClient,
    gitProvidersApiClient,
    sampleApiClient,
  } = useApiClient()
  const [repos, setRepos] = useState<GitRepository[]>([])
  const [gitProvidersForUrl, setGitProvidersForUrl] = useState<GitProvider[]>(
    [],
  )
  const [loadingRepos, setLoadingRepos] = useState(false)
  const listRef = useRef<any>()

  useEffect(() => {
    if (instance && activeStep === 1) {
      instance.loadAddon(fitAddon.current)
      fitAddon.current.fit()
    }
  }, [instance, activeStep])

  const {
    control,
    handleSubmit,
    formState: { isValid },
    setValue,
    watch,
  } = useForm({
    defaultValues: {
      repo: '',
      providerId: '',
      editor: daytonaConfig?.defaultIde || Editor.Vscode,
      target: '',
    },
  })

  const selectedEditor = watch('editor')
  const selectedRepo = watch('repo')

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
        .then((response: AxiosResponse<TargetDTO[], any>) => {
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

  useEffect(() => {
    if (sampleApiClient) {
      setLoadingRepos(true)
      sampleApiClient
        .listSamples()
        .then((response: AxiosResponse<Sample[], any>) => {
          if (response.data.length > 0) {
            setSamples(response.data)
            setLoadingRepos(false)
          }
        })
        .catch((error: any) => {
          setLoadingRepos(false)
          console.log(error)
        })
    }
  }, [sampleApiClient])

  const repoOptions = useMemo(() => {
    return [...samples.map((s) => s.gitUrl), ...repos.map((r) => r.url)]
  }, [repos, samples])

  useEffect(() => {
    if (createdWorkspaceId && activeStep === 2 && workspaceApiClient) {
      const fetchWorkspace = async () => {
        try {
          const response = await workspaceApiClient.findWorkspace(
            createdWorkspaceId,
          )
          setWorkspace(response.data)

          if (listRef.current) {
            listRef.current.openInEditor(
              createdWorkspaceId,
              response.data.name,
              selectedEditor,
            )
          }
        } catch (error) {
          console.log(error)
        }
      }

      fetchWorkspace()
    }
  }, [createdWorkspaceId, activeStep, workspaceApiClient])

  useEffect(() => {
    if (selectedRepo) {
      const fetchProviders = async () => {
        const encodedUrl = encodeURIComponent(selectedRepo)
        try {
          const response = await gitProvidersApiClient?.listGitProvidersForUrl(
            encodedUrl,
          )
          if (response && response.data) {
            setGitProvidersForUrl(response.data)
            if (response.data.length > 0) {
              setValue('providerId', response.data[0].id)
            }
          }
        } catch (error) {
          console.log(error)
        }
      }

      fetchProviders()
    }
  }, [selectedRepo, setValue, gitProvidersApiClient])

  const onSubmit = async (data: any) => {
    let options = ['create', data.repo, '-t', data.target, '--no-ide', '-y']

    if (data.providerId) {
      options = options.concat(['--git-provider-config', data.providerId])
    }
    try {
      await new Promise<void>((resolve, reject) => {
        const result = client?.extension.host?.cli.exec('daytona', options, {
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
        })
      })
      setActiveStep(2)
    } catch (error) {
      setIsError(true)
    }
  }

  const handleNext = () => {
    handleSubmit(onSubmit)()
    if (isValid) {
      setActiveStep(1)
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
        .deleteWorkspace(createdWorkspaceId as string, true)
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
              {steps.map((label) => {
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
                            options={repoOptions}
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
                    {gitProvidersForUrl.length > 1 && (
                      <Box display="flex" flexDirection="column" gap={1}>
                        <Typography variant="body1">
                          Choose Git Provider
                        </Typography>
                        <Controller
                          name="providerId"
                          control={control}
                          rules={{ required: 'This field is required' }}
                          render={({ field, fieldState: { error } }) => (
                            <FormControl error={!!error}>
                              <Select {...field}>
                                {gitProvidersForUrl.map((provider) => (
                                  <MenuItem
                                    key={provider.id}
                                    value={provider.id}
                                  >
                                    {provider.alias}
                                  </MenuItem>
                                ))}
                              </Select>
                              <FormHelperText>{error?.message}</FormHelperText>
                            </FormControl>
                          )}
                        />
                      </Box>
                    )}
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
                      ref={listRef}
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
