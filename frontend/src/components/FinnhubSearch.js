import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Stack from '@mui/material/Stack';
import Autocomplete from '@mui/material/Autocomplete';

export default function FinnhubSearch({ defaultValue, onSearchResult }) {
  const [stocks, setStocks] = useState([]);
  const [inputValue, setInputValue] = useState(defaultValue || '');
  const [selectedValue, setSelectedValue] = useState(null);
  const dataFetchedRef = useRef(false);

  useEffect(() => {
    const fetchData = async () => {
      if (!dataFetchedRef.current) {
        const data = await fetchCryptoData();
        setStocks(data);
        dataFetchedRef.current = true;
      }
    };

    fetchData();
  }, [defaultValue]);

  useEffect(() => {
    if (selectedValue) {
      onSearchResult(selectedValue);
    }
  }, [selectedValue, onSearchResult]);

  return (
    <Stack spacing={2}>
      <Autocomplete
        freeSolo
        id="free-solo-1-demo"
        disableClearable
        inputValue={inputValue}
        onInputChange={(event, newInputValue) => {
          setInputValue(newInputValue);
        }}
        onChange={(event, newValue) => {
          setSelectedValue(newValue);
        }}
        options={inputValue.length >= 2 ? stocks.map((option) => option.title) : []}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Finnhub Api Search"
            InputProps={{
              ...params.InputProps,
              type: 'search',
            }}
          />
        )}
      />
    </Stack>
  );
}

// Function to fetch crypto data from the public folder
const fetchCryptoData = async () => {
  const response = await fetch('/finnHubData.txt');
  const text = await response.text();

  // Split the text into individual JSON objects and parse them
  const data = text.split('\n').map(line => JSON.parse(line));

  return data;
}
