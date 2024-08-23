import { useEffect, useState } from "react";
import { Box, Stepper, Step, StepLabel, Button, TextField, Typography } from "@mui/material"
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from "react-hook-form";

import Header from "./shared/Header"

const steps = ['Setup', 'Preparing', 'Ready'];

const CreateWorkspace = () => {
  const [activeStep, setActiveStep] = useState(0);
  const navigate = useNavigate();

  const { control, handleSubmit, formState: { errors, isValid } } = useForm({
    defaultValues: {
      repo: '',
      editor: ''
    }
  });

  const onSubmit = (data: any) => {
    console.log('gggggg', data)
  }

  const handleNext = () => {
    if (activeStep === 0) {      
      handleSubmit(onSubmit)();
      if (isValid) {
        setActiveStep((prevActiveStep) => prevActiveStep + 1);    
      }
    }
  };

  useEffect(() => {
    if (activeStep === steps.length) {
      navigate('/');
    }
  }, [activeStep])
  

  return (
    <Box>
      <Header />
      <Box display="flex" flexDirection="column" alignItems="center" p={4}>
        <Box width="100%">          
          <Stepper activeStep={activeStep}>
            {steps.map((label, index) => {
              const stepProps: { completed?: boolean } = {};          
              return (
                <Step key={label} {...stepProps}>
                  <StepLabel>{label}</StepLabel>
                </Step>
              );
            })}
          </Stepper>                    
          <Box mt={6}>
          {activeStep === 0 && (
            <>
              <Box display={"flex"} flexDirection="column" gap={1}>
                <Typography variant="body1">Choose source (Browse your repos, select a predefined sample, or find with URL)</Typography>
                <Controller
                  name="repo"
                  control={control}  
                  rules={{ required: "This field is required" }}            
                  render={({ field }) => <TextField error={!!errors.repo} helperText={errors.repo?.message} placeholder="https://..., git@..." fullWidth {...field} />}
                />
              </Box>
              {/* <Controller
                name="editor"
                control={control}
                render={({ field }) => <Select 
                  {...field} 
                  options={[
                    { value: "chocolate", label: "Chocolate" },
                    { value: "strawberry", label: "Strawberry" },
                    { value: "vanilla", label: "Vanilla" }
                  ]} 
                />}
              /> */}
            </>
          )} 

          {activeStep === 1 && (
            <Typography variant="body1" mb={1}>Preparing workspace</Typography>
          )}
          </Box>

          <Box sx={{ display: 'flex', flexDirection: 'row', pt: 2 }}>              
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