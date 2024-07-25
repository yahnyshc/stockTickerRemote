import * as React from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';
import Box from '@mui/material/Box';

export default function Search() {
  return (
    <Box 
      sx={{
        paddingTop: '10vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
        <Stack spacing={2} sx={{ width: 300 }}>
        <Autocomplete
            freeSolo
            id="free-solo-2-demo"
            disableClearable
            options={stocks.map((option) => option.title)}
            renderInput={(params) => (
            <TextField
                {...params}
                label="Search stock"
                InputProps={{
                ...params.InputProps,
                type: 'search',
                }}
            />
            )}
        />
        </Stack>
    </Box>
  );
}

// Top 100 films as rated by IMDb users. http://www.imdb.com/chart/top
const stocks = [
  { title: 'BTC' },
  { title: 'NVDA' },
  { title: 'ETH' },
];
