import { useContext, useEffect, useState } from 'react'
import {
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

import Header from './shared/Header'
import { DockerClientContext } from '../contexts/DockerClientContext'
import { ApiClientContext } from '../contexts/ApiClientContext'
import { Workspace } from '../api-client'
import WorkspaceItem from './shared/WorkspaceItem'

const steps = ['Setup', 'Preparing', 'Ready']

const CreateWorkspace = () => {
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useNavigate()
  const client = useContext(DockerClientContext)
  const { instance, ref } = useXTerm()
  const [isError, setIsError] = useState(false)
  const [createdWorkspaceId, setCreatedWorkspaceId] = useState<string | null>(
    null,
  )
  const [workspace, setWorkspace] = useState<Workspace | null>(null)
  const apiClient = useContext(ApiClientContext)

  const {
    control,
    handleSubmit,
    formState: { isValid },
  } = useForm({
    defaultValues: {
      repo: '',
      editor: '',
    },
  })

  useEffect(() => {
    if (createdWorkspaceId && activeStep === 2 && apiClient) {
      apiClient
        .getWorkspace(createdWorkspaceId)
        .then((response: any) => {
          setWorkspace(response.data)
        })
        .catch((error: any) => {
          console.log(error, '-------')
        })
    }
  }, [createdWorkspaceId, activeStep, apiClient])

  const onSubmit = async (data: any) => {
    try {
      await new Promise<void>((resolve, reject) => {
        const result = client?.extension.host?.cli.exec(
          'daytona',
          ['create', data.repo, '-t', 'local'],
          {
            stream: {
              onOutput: (message: any) => {
                const workspaceIdRegex = /ID\s+([a-f0-9]+)/
                const match = message.stdout.match(workspaceIdRegex)
                if (match) {
                  const workspaceId = match[1]
                  setCreatedWorkspaceId(workspaceId)
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
                      <TextField
                        error={!!error}
                        helperText={error?.message}
                        placeholder="https://..., git@..."
                        fullWidth
                        {...field}
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
                        <Select {...field}>
                          <MenuItem value="editor1">VS Code</MenuItem>
                          <MenuItem value="editor2">VS Code - Browser</MenuItem>
                          <MenuItem value="editor3">Terminal SSH</MenuItem>
                          <MenuItem value="editor4">CLion</MenuItem>
                          <MenuItem value="editor5">GoLand</MenuItem>
                          <MenuItem value="editor6">
                            Intellij IDEA Ultimate
                          </MenuItem>
                          <MenuItem value="editor7">PHP Storm</MenuItem>
                          <MenuItem value="editor8">
                            PyCharm Professional
                          </MenuItem>
                          <MenuItem value="editor9">Rider</MenuItem>
                          <MenuItem value="editor10">RubyMine</MenuItem>
                          <MenuItem value="editor11">WebStorm</MenuItem>
                        </Select>
                        <FormHelperText>{error?.message}</FormHelperText>
                      </FormControl>
                    )}
                  />
                </Box>
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
                {workspace && (
                  <Box mt={4}>
                    <WorkspaceItem workspace={workspace} />
                  </Box>
                )}
              </>
            )}
          </Box>

          {activeStep === 0 && (
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
