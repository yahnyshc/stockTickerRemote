import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function FinnhubSearch({ defaultValue, onChange, sx }) {
  const [stocks, setStocks] = useState([]);
  const [inputValue, setInputValue] = useState(defaultValue || '');
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

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
    onChange(newInputValue);
  };

  return (
      <Autocomplete
        sx={sx}
        freeSolo
        id="free-solo-1-demo"
        disableClearable
        inputValue={inputValue}
        onInputChange={handleInputChange}
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
