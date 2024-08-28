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
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import { useForm, Controller } from 'react-hook-form'

import Header from './shared/Header'
import { DockerClientContext } from '../contexts/DockerClientContext'

const steps = ['Setup', 'Preparing', 'Ready']

const CreateWorkspace = () => {
  const [activeStep, setActiveStep] = useState(0)
  const navigate = useNavigate()
  const client = useContext(DockerClientContext)

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

  const onSubmit = async (data: any) => {
    await new Promise<void>((resolve, reject) => {
      const result = client?.extension.host?.cli.exec(
        'daytona',
        ['create', data.repo, '-t', 'local'],
        {
          stream: {
            onOutput: (message: any) => console.log(message),
            onClose: () => resolve(),
            onError: (error: any) => reject(error),
          },
        },
      )

      console.log(result)
    })
  }

  const handleNext = () => {
    if (activeStep === 0) {
      handleSubmit(onSubmit)()
      if (isValid) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1)
      }
    }
  }

  useEffect(() => {
    if (activeStep === steps.length) {
      navigate('/')
    }
  }, [activeStep])

  return (
    <Box>
      <Header />
      <Box display="flex" flexDirection="column" alignItems="center" p={4}>
        <Box width="100%">
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
          <Box mt={6} px={8}>
            {activeStep === 0 && (
              <Box display="flex" flexDirection="column" gap={2}>
                <Box display="flex" flexDirection="column" gap={1}>
                  <Typography variant="body1">
                    Choose source (Browse your repos, select a predefined
                    sample, or find with URL)
                  </Typography>
                  <Controller
                    name="repo"
                    control={control}
                    rules={{ required: 'This field is required' }}
                    render={({ field, fieldState: { error } }) => (
                        <TextField
                          error={!!error}
                          helperText={error?.message}
                          placeholder="https://..., git@..."
                          fullWidth
                          {...field}
                        />
                      )
                    }
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

            {activeStep === 1 && (
              <Typography variant="body1" mb={1}>
                Preparing workspace
              </Typography>
            )}
          </Box>

          <Box display="flex" flexDirection="row" pt={2} px={8}>
            <Box sx={{ flex: '1 1 auto' }} />
            <Button onClick={handleNext}>
              {activeStep === steps.length - 1 ? 'Finish' : 'Next'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default CreateWorkspace
