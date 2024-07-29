import React, { useState, useEffect, useRef } from 'react';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';

export default function IconSearch({ defaultValue, onSearchResult }) {
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
  }, []);

  const handleInputChange = (event, newInputValue) => {
    setInputValue(newInputValue);
  };

  const handleSelect = (event, newValue) => {
    if (newValue) {
      onSearchResult(newValue);
    }
  };

  return (
      <Autocomplete
        sx={{ marginTop: '10px' }}
        freeSolo
        id="free-solo-2-demo"
        disableClearable
        inputValue={inputValue}
        onInputChange={handleInputChange}
        onChange={handleSelect}
        options={inputValue.length >= 2 ? stocks.map((option) => option.title) : []}
        renderInput={(params) => (
          <TextField
            {...params}
            label="FMP Icon Search"
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
  const response = await fetch('/fmpIconData.txt');
  const text = await response.text();

  // Split the text into individual JSON objects and parse them
  const data = text.split('\n').map(line => JSON.parse(line));

  return data;
};
