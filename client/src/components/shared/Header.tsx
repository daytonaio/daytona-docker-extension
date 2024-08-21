import { Stack, Typography, Box, Button } from '@mui/material';
import { Link, useLocation } from 'react-router-dom';

const Header = () => {
  let location = useLocation();

  console.log(location, '-----');
  
  return (
    <Stack 
      direction="row" 
      justifyContent="space-between"
      alignItems="center"
      spacing={2}>
        <Box>
          <Typography variant="h1">Daytona</Typography>
        </Box>
        <Link to="/create"><Button variant="contained">Create</Button></Link>
    </Stack>
  )
}

export default Header