import * as React from 'react';
import Box from '@mui/material/Box';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';

export default function StrictnessSlider({value, setValue, defaultValue = 50}) {
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const marks = [
    {
      value: 0,
      label: 'Loose',
    },
    {
      value: 50,
      label: 'Moderate',
    },
    {
      value: 100,
      label: 'Strict',
    },
  ];

  return (
    <Box sx={{
        width: '100%',
        display: 'flex',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'column',

    }}>
        <Box sx={{
            width: '100%',
            textAlign: 'center',
            marginBottom: '1rem',
            flex: 1/3,
        }}>
            <Typography fontSize={20} fontWeight={500}>
                Strictness
            </Typography>
        </Box>
        <Box sx={{
            width: '100%',
            flex: 1/3
        }}>
            <Slider
                size="medium"
                defaultValue={defaultValue}
                aria-label="Default"
                valueLabelDisplay="auto"
                sx={{
                    color: 'primary.main', // Change color here

                }}
                marks={marks}
                value={value}
                onChange={handleChange}
            />
        </Box>

        <Box sx={{
            width: '100%',
            flex: 1/3,
            textAlign: 'center',
        }}>
            <Typography
            variant="caption"
            fontSize={20}
            sx={{
                color: 'transparent',
            }}
            >
            {`%`}
            </Typography>
            <Typography
            variant="caption"
            fontSize={20}
            sx={{
                color: 'text.disabled',
            }}
            >
            {`${value}%`}
            </Typography>
        </Box>
    </Box>
  );
}


