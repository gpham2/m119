import { Box } from '@mui/material';
import StrictnessSlider from './components/StricnessSlider';
import { useState } from 'react';
import ExerciseToggleButtons from './components/ExerciseSelector';
import Scanner from './components/Scanner';
function App() {
  const [sliderVal, setSliderVal] = useState(50);
  const [exercise, setExercise] = useState('bicep');
  return (
    <Box sx={{padding: 30, justifyContent: 'center', alignItems: 'center', display: 'flex', flexDirection: 'column'}}>
      <Box sx={{ width: '80%', mb: 20 }}>
        <StrictnessSlider value={sliderVal} setValue={setSliderVal}/>
      </Box>
      <Box sx={{ width: '80%', justifyContent: 'center', alignItems: 'center', mb: 20}}>
        <ExerciseToggleButtons exercise={exercise} setExercise={setExercise}/>
      </Box>

      <Box sx={{ width: '80%', justifyContent: 'center', alignItems: 'center' }}>
        <Scanner />
      </Box>
    </Box>
    
  );
}

export default App;
