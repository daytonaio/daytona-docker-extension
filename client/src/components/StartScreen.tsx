import { Box, Typography } from "@mui/material"
import Header from "./shared/Header"

import { ReactComponent as Logo } from '../assets/logo.svg';

const StartScreen = () => {
  return (
    <Box display="flex" flexDirection="column" alignItems="center">
      <Header />

      <Box display="flex" flexDirection="column" alignItems="center" pt={4}>
        <Logo width={60} height={60}/>
        <Typography mt={4} variant="h6" textAlign={"center"}>The Open Source Development Environment Manager <br />
        Set up a development environment on any infrastructure, with a single click</Typography>
      </Box>
    </Box>
  )
}

export default StartScreen