import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Container, Paper, TextField, IconButton, FormControlLabel, Checkbox } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { useConfigContext } from '../hooks/useConfigContext';
import FinnhubSearch from './FinnhubSearch';
import IconSearch from './IconSearch';

const SubsList = () => {
  const { configs, selected, dispatch } = useConfigContext();
  const [editIndex, setEditIndex] = React.useState(null);
  const [editValue, setEditValue] = React.useState('');
  const [newSub, setNewSub] = React.useState('');
  const [showNewSubField, setShowNewSubField] = React.useState(false);
  const [editConfigName, setEditConfigName] = React.useState(false);
  const [configNameValue, setConfigNameValue] = React.useState(selected ? selected.name : '');
  const [updatingConfig, setUpdatingConfig] = React.useState(false);
  const [submenuIndex, setSubmenuIndex] = React.useState(null);
  const [config, setConfig] = React.useState(selected)
  const [submenuChanges, setSubmenuChanges] = React.useState({});

  React.useEffect(() => {
    if (selected) {
      setConfig(selected);
      setConfigNameValue(selected.name);
      const initialSubmenuChanges = selected.subs.reduce((acc, _, index) => {
        acc[index] = { apiName: selected.api_names[index], logoName: selected.logo_names[index] };
        return acc;
      }, {});
      setSubmenuChanges(initialSubmenuChanges);
    }
  }, [selected]);

  const handleDelete = async (toDelete) => {
    setUpdatingConfig(true);
    const index = config.subs.indexOf(toDelete);
    setConfig({
      ...config,
      subs: config.subs.filter((sub) => sub !== toDelete),
      api_names: config.api_names.filter((_, i) => i !== index),
      logo_names: config.logo_names.filter((_, i) => i !== index)
    });
  };

  const handleEdit = (index) => (event) => {
    event.stopPropagation();
    setEditIndex(index);
    setEditValue(config.subs[index]);
  };

  const handleSave = async (event) => {
    event.stopPropagation();
    setUpdatingConfig(true);
    setConfig({
      ...config,
      subs: [...config.subs.slice(0, editIndex), editValue, ...config.subs.slice(editIndex + 1)]
    });
    setEditIndex(null);
    setEditValue('');
  };

  const handleActiveChange = async (event) => {
    if (event.target.checked === true) {
      console.log("Setting current");
      const clearCurrent = (c) => {
        if (c.current === true) {
          c.current = false;
          dispatch({ type: 'UPDATE_CONFIG', payload: c });
          fetch(`${process.env.REACT_APP_BACKEND_URL}/config/edit`, {
            method: 'PATCH',
            body: JSON.stringify(c),
            headers: {
              'Content-Type': 'application/json',
            },
          });
        }
      };
      configs.forEach(clearCurrent);
      setUpdatingConfig(true);
      setConfig({ ...config, current: true });
    }
  };

  const handleAddNewClick = () => {
    setShowNewSubField(true);
  };

  React.useEffect(() => {
    console.log("Configs changed:  ", configs);
  }, [configs]);

  const handleAddNew = React.useCallback(async () => {
    if (newSub && !config.subs.includes(newSub)) {
      setUpdatingConfig(true);
      setConfig({
        ...config,
        subs: [...config.subs, newSub],
        api_names: [...config.api_names, newSub],
        logo_names: [...config.logo_names, newSub]
      });
      setShowNewSubField(false);
      setNewSub('');
    }
  }, [newSub, config]);

  React.useEffect(() => {
    console.log("Config updated: ", config);
    dispatch({ type: 'UPDATE_CONFIG', payload: config });

    const updateConfig = async () => {
      try {
        await fetch(`${process.env.REACT_APP_BACKEND_URL}/config/edit`, {
          method: 'PATCH',
          body: JSON.stringify(config),
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } catch (error) {
        console.error('Error updating config:', error);
      }
    };

    if (updatingConfig) {
      updateConfig();
      setUpdatingConfig(false);
    }

  }, [config, dispatch, updatingConfig]);

  const handleConfigNameEdit = () => {
    setEditConfigName(true);
  };

  const handleConfigNameSave = async () => {
    setUpdatingConfig(true);
    setConfig({ ...config, name: configNameValue });
    setEditConfigName(false);
  };

  const handleSubmenuChange = (index, apiName, logoName) => {
    setSubmenuChanges({
      ...submenuChanges,
      [index]: { apiName, logoName }
    });
  };

  const handleSubmenuClose = (index) => {
    console.log("Saving mappings");
    if (submenuChanges[index]) {
      const { apiName, logoName } = submenuChanges[index];
      console.log("apiName: ", apiName, " logoName: ", logoName);
      setUpdatingConfig(true);
      const newApiNames = [...config.api_names];
      const newLogoNames = [...config.logo_names];
      newApiNames[index] = apiName;
      newLogoNames[index] = logoName;
      setConfig({
        ...config,
        api_names: newApiNames,
        logo_names: newLogoNames
      });
    }
    setSubmenuIndex(null);
  };

  const paperStyle = { padding: "10px 10px", width: "80%", margin: "20px auto", position: 'relative' };

  return (
    <Container>
      <Paper elevation={3} style={paperStyle}>
        <div 
          style={{
            display: 'flex', 
            justifyContent: "center", 
            textAlign: 'center', 
            alignItems: 'center', 
            border: '1px solid black',
            borderRadius: '10px',
            backgroundColor: '#292929',
            marginBottom: '10px',
            color: 'white',
            position: 'relative',
            padding: '20px'
          }}>
          {editConfigName ? (
            <TextField
              value={configNameValue}
              onChange={(e) => setConfigNameValue(e.target.value)}
              style={{ 
                flex: 1, 
                textAlign: 'center', 
                color: 'white', 
                fontSize: '2rem', 
                backgroundColor: '#292929',
                border: 'none'
              }}
              inputProps={{
                style: {
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '2rem'
                }
              }}
            />
          ) : (
            <h1 style={{ flex: 1, position: 'relative' }}>{configNameValue}</h1>
          )}
          {editConfigName ? (
            <IconButton edge="end" aria-label="save" onClick={handleConfigNameSave}>
              <CheckIcon style={{ color: 'white' }} />
            </IconButton>
          ) : (
            <IconButton edge="end" aria-label="edit" onClick={handleConfigNameEdit}>
              <EditIcon style={{ color: 'white', position: 'absolute', right: '10px'}} />
            </IconButton>
          )}
        </div>
        <Container sx={{ width: '100%', display: "flex", justifyContent: "center" }}>
          <List dense sx={{ width: '100%', bgcolor: 'background.paper' }}>
            {config.subs.map((value, index) => {
              const labelId = `checkbox-list-secondary-label-${value}`;
              return (
                <div key={value}>
                  <ListItem
                    secondaryAction={
                      <div>
                        {editIndex === index ? (
                          <IconButton edge="end" aria-label="save" onClick={handleSave}>
                            <CheckIcon />
                          </IconButton>
                        ) : (
                          <IconButton edge="end" aria-label="edit" onClick={handleEdit(index)}>
                            <EditIcon />
                          </IconButton>
                        )}
                        <IconButton edge="end" aria-label="delete" onClick={() => handleDelete(value)}>
                          <DeleteIcon />
                        </IconButton>
                      </div>
                    }
                    disablePadding
                    style={{ borderLeft: '4px solid red', marginTop: '10px' }} // Add this line to include the red vertical line
                  >
                    <ListItemButton onClick={() => setSubmenuIndex(submenuIndex === index ? null : index)}>
                      <ListItemAvatar>
                        <Avatar
                          alt={`Avatar ${config.logo_names[index]}`}
                          src={`https://financialmodelingprep.com/image-stock/${config.logo_names[index]}.png`}
                        />
                      </ListItemAvatar>
                      {editIndex === index ? (
                        <TextField
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      ) : (
                        <ListItemText id={labelId} primary={`${value}`} />
                      )}
                    </ListItemButton>
                  </ListItem>
                  {submenuIndex === index && (
                    <div style={{ padding: '10px 20px' }}>
                      <FinnhubSearch
                        fullWidth
                        placeholder="Finnhub search"
                        margin="dense"
                        defaultValue={config.api_names[index]} // Pass default value here
                        onSearchResult={(apiName) => handleSubmenuChange(index, apiName, submenuChanges[index]?.logoName)}
                      />
                      <IconSearch
                        fullWidth
                        placeholder="FMP Icon search"
                        margin="dense"
                        defaultValue={config.logo_names[index]} // Pass default value here
                        onSearchResult={(logoName) => handleSubmenuChange(index, submenuChanges[index]?.apiName, logoName)}
                      />
                      <Button onClick={() => handleSubmenuClose(index)}>Save</Button>
                    </div>
                  )}
                </div>
              );
            })}
            <Stack spacing={2} direction="column" alignItems="center" marginTop="20px">
              {showNewSubField &&
                <div>
                  <TextField
                    value={newSub}
                    onChange={(e) => setNewSub(e.target.value)}
                    placeholder="New subscription"
                  />
                </div>
              }
              <Button 
                sx={{
                  backgroundColor: '#292929',
                }}
                variant="contained" 
                onClick={showNewSubField ? handleAddNew : handleAddNewClick}>
                Add new subscription
              </Button>
              <div >
              <FormControlLabel
                  control={<Checkbox checked={config.current} onChange={(event) => handleActiveChange(event)} />}
                  label="Default Config"
                />
            </div>
            </Stack>
          </List>
        </Container>
      </Paper>
    </Container>
  );
};

export default SubsList;
