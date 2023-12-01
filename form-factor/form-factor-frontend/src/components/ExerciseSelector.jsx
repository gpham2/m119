import * as React from 'react';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import FitnessCenterIcon from '@mui/icons-material/FitnessCenter';
import DirectionsRunIcon from '@mui/icons-material/DirectionsRun';
import RowingIcon from '@mui/icons-material/Rowing';
import { Box, Typography } from '@mui/material';

export default function ExerciseToggleButtons({ setExercise, exercise, size = '10rem' }) {
  const handleExercise = (
    event,
    newExercise
  ) => {
    setExercise(newExercise);
  };

  return (
    <Box sx={{display: 'flex', width: '100%', justifyContent: 'center', alignItems: 'center', flexDirection: 'column'}}>
        <Box sx={{
            width: '100%',
            textAlign: 'center',
            marginBottom: '2rem',
            flex: 1/3,
        }}>
            <Typography fontSize={20} fontWeight={500}>
                Exercise
            </Typography>
        </Box>
        <Box sx={{
            width: '100%',
            textAlign: 'center',
            marginBottom: '1rem',
            flex: 2/3,
        }}> 
            <ToggleButtonGroup
            value={exercise}
            exclusive
            onChange={handleExercise}
            aria-label="exercise type"
            >
            <ToggleButton value="bicep" aria-label="bicep curl">
                <FitnessCenterIcon sx={{ fontSize: size }}/>
            </ToggleButton>
            <ToggleButton value="pushup" aria-label="pushup">
                <DirectionsRunIcon sx={{ fontSize: size }}/>
            </ToggleButton>
            <ToggleButton value="rowing" aria-label="rowing">
                <RowingIcon sx={{ fontSize: size }}/>
            </ToggleButton>
            </ToggleButtonGroup>
        </Box>
    </Box>
  );
}
