import * as React from 'react';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import Button from '@mui/material/Button';
import { Container, Paper, TextField, IconButton, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Tooltip, Slider } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import CheckIcon from '@mui/icons-material/Check';
import { useConfigContext } from '../hooks/useConfigContext';
import FinnhubSearch from './FinnhubSearch';
import IconSearch from './IconSearch';
import { useAuthContext } from '../hooks/useAuthContext';
import DefaultSwitch from './DefaultSwitch';
import CloseIcon from '@mui/icons-material/Close';

const SubsList = () => {
  const { configs, selected, dispatch } = useConfigContext();
  const [editIndex, setEditIndex] = React.useState(null);
  const [editValue, setEditValue] = React.useState('');
  const [newSub, setNewSub] = React.useState('');
  const [showNewSubField, setShowNewSubField] = React.useState(false);
  const [editConfigName, setEditConfigName] = React.useState(false);
  const [configNameValue, setConfigNameValue] = React.useState('');
  const [submenuIndex, setSubmenuIndex] = React.useState(null);
  const [config, setConfig] = React.useState(selected);
  const [submenuChanges, setSubmenuChanges] = React.useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

  const { user } = useAuthContext();

  const updateConfig = async (newConfig) => {
    try {
      await fetch(`${process.env.REACT_APP_BACKEND_URL}/config/edit?userId=${user.id}`, {
        method: 'PATCH',
        body: JSON.stringify(newConfig),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`,
        },
      });

      dispatch({ type: 'UPDATE_CONFIG', payload: newConfig });
      dispatch({type: 'U'})

      setConfig(newConfig);
    } catch (error) {
      console.error('Error updating config:', error);
    }
  };

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
    const index = config.subs.indexOf(toDelete);
    await updateConfig({
      ...config,
      subs: config.subs.filter((sub) => sub !== toDelete),
      api_names: config.api_names.filter((_, i) => i !== index),
      logo_names: config.logo_names.filter((_, i) => i !== index),
    });
  };

  const handleEdit = (index) => (event) => {
    event.stopPropagation();
    setEditIndex(index);
    setSubmenuIndex(index);
    setEditValue(config.subs[index]);
  };

  const handleSave = async () => {
    updateConfig({
      ...config,
      subs: [...config.subs.slice(0, editIndex), editValue, ...config.subs.slice(editIndex + 1)],
    });
    setEditIndex(null);
    setEditValue('');
  };


  const handleActiveChange = async (event) => {
    if (event.target.checked === true) {
      const clearCurrent = (c) => {
        if (c.current === true) {
          c.current = false;
          dispatch({ type: 'UPDATE_CONFIG', payload: c });
          fetch(`${process.env.REACT_APP_BACKEND_URL}/config/edit?userId=${user.id}`, {
            method: 'PATCH',
            body: JSON.stringify(c),
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${user.token}`,
            },
          });
        }
      };
      configs.forEach(clearCurrent);
      await updateConfig({ ...config, current: true });
    }
  };

  const handleAddNewClick = () => {
    setShowNewSubField(true);
  };

  React.useEffect(() => {
    console.log('Configs changed:  ', configs);
  }, [configs]);

  const handleAddNew = async () => {
    if (newSub && !config.subs.includes(newSub)) {
      await updateConfig({
        ...config,
        subs: [...config.subs, newSub],
        api_names: [...config.api_names, newSub],
        logo_names: [...config.logo_names, newSub],
      });
      setShowNewSubField(false);
      setNewSub('');
    }
  };

  const handleConfigNameEdit = () => {
    setEditConfigName(true);
  };

  const handleConfigNameSave = async () => {
    await updateConfig({ ...config, name: configNameValue });
    setEditConfigName(false);
  };

  const handleSubmenuChange = (index, apiName, logoName) => {
    setSubmenuChanges((prevChanges) => ({
      ...prevChanges,
      [index]: {
        apiName: apiName !== undefined ? apiName : config.api_names[index],
        logoName: logoName !== undefined ? logoName : config.logo_names[index],
      },
    }));
  };

  const handleSubmenuClose = (index) => {
    if (submenuChanges[index]) {
      const { apiName, logoName } = submenuChanges[index];
      const newApiNames = [...config.api_names];
      const newLogoNames = [...config.logo_names];
      newApiNames[index] = apiName;
      newLogoNames[index] = logoName;
      updateConfig({
        ...config,
        api_names: newApiNames,
        logo_names: newLogoNames,
      });
    }
    setSubmenuIndex(null);
  };

  const handleSwitchTimeChange = (event, value) => {
    setConfig({ ...config, switch_time: value });
  };

  const handleSwitchTimeChangeCommitted = async (event, value) => {
    await updateConfig({ ...config, switch_time: value });
  };

  const confirmDeleteConfig = async () => {
    if (!user || !user.id || !user.token) {
      console.error("User is not authenticated");
      return;
    }

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/config/delete?userId=${user.id}`, {
        method: 'DELETE',
        body: JSON.stringify(config),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
      });

      const json = await response.json();

      if (response.ok) {
        dispatch({ type: 'DELETE_CONFIG', payload: json });
        dispatch({ type: 'SET_SELECTED', payload: configs[0] });
      } else {
        console.error("Failed to create new config:", json);
      }
    } catch (error) {
      console.error("An error occurred while deleting a config:", error);
    }
  };

  const handleDeleteConfig = async () => {
    setDeleteDialogOpen(true);
  };

  const paperStyle = { padding: '10px 10px', width: '90%', margin: '10px auto', position: 'relative' };

  return (
    <Container>
      <Paper elevation={3} style={paperStyle}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            textAlign: 'center',
            alignItems: 'center',
            border: '1px solid black',
            borderRadius: '10px',
            backgroundColor: '#292929',
            marginBottom: '10px',
            color: 'white',
            position: 'relative',
            padding: '10px',
          }}
        >
          <DefaultSwitch
            checked={config.current}
            onChange={(event) => handleActiveChange(event)}
            inputProps={{ 'aria-label': 'controlled' }}
            label="Default Config"
            sx={{ position: 'absolute', right: '0px', top: '0px' }}
          />
          <Tooltip title="Delete Config" arrow>
            <IconButton
              edge="end"
              aria-label="delete"
              onClick={handleDeleteConfig}
              style={{ position: 'absolute', right: '17px', top: '60px' }}
            >
              <DeleteIcon style={{ color: '#DC143C' }} />
            </IconButton>
          </Tooltip>
          {editConfigName ? (
            <IconButton
              edge="end"
              aria-label="save"
              onClick={handleConfigNameSave}
              style={{ position: 'absolute', right: '17px', top: '30px' }}
            >
              <CheckIcon style={{ color: 'white' }} />
            </IconButton>
          ) : (
            <Tooltip title="Edit Config Name" arrow>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={handleConfigNameEdit}
                style={{ position: 'absolute', right: '17px', top: '30px' }}
              >
                <EditIcon style={{ color: 'white' }} />
              </IconButton>
            </Tooltip>
          )}
          {editConfigName ? (
            <TextField
              value={configNameValue}
              onChange={(e) => setConfigNameValue(e.target.value)}
              style={{
                textAlign: 'center',
                color: 'white',
                fontSize: '2rem',
                backgroundColor: '#292929',
                border: 'none',
                marginRight: '35px',
                marginLeft: '35px',
              }}
              inputProps={{
                style: {
                  textAlign: 'center',
                  color: 'white',
                  fontSize: '2rem',
                },
              }}
            />
          ) : (
            <h1>{configNameValue}</h1>
          )}
        </div>
        <Container sx={{ width: '100%', display: 'flex', justifyContent: 'center' }}>
          <List dense sx={{ width: '100%', bgcolor: 'background.paper', paddingTop: '0px' }}>
            {config.subs.map((value, index) => {
              const labelId = `checkbox-list-secondary-label-${value}`;
              return (
                <div key={value}>
                  <ListItem
                    secondaryAction={
                      <div>
                        {editIndex === index ? (
                          <IconButton edge="end" aria-label="save" onClick={() => handleSave()}>
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
              {showNewSubField && (
                <FinnhubSearch
                  margin="dense"
                  placeholder="New subscription"
                  defaultValue={null} // Pass default value here
                  onSearchResult={(sub) => setNewSub(sub)}
                  sx={{ width: '200px' }}
                />
              )}
              <div style={{ position: 'relative', width: '100%' }}>
                <Button
                  sx={{ backgroundColor: '#292929', color: 'white', marginLeft: showNewSubField ? '4%' : '0' }}
                  variant="contained"
                  onClick={showNewSubField ? handleAddNew : handleAddNewClick}
                >
                  Add new subscription
                </Button>
                {showNewSubField && (
                  <IconButton
                    sx={{
                      backgroundColor: '#ffffff',
                      color: '#000',
                      margin: '5px 0 5px 5px',
                      width: '30px',
                      height: '30px',
                    }}
                    onClick={() => setShowNewSubField(false)}
                  >
                    <CloseIcon />
                  </IconButton>
                )}
                {config.subs && config.subs.length > 0 && (
                  <div style={{ marginTop: '20px' }}>
                    <h6 style={{ margin: '0' }}>Switch Speed (seconds)</h6>
                    <Slider
                      value={config.switch_time}
                      onChange={handleSwitchTimeChange}
                      onChangeCommitted={handleSwitchTimeChangeCommitted}
                      aria-labelledby="continuous-slider"
                      min={1}
                      max={60}
                      valueLabelDisplay="auto"
                      sx={{
                        width: '150px',
                        color: 'black',
                        '& .MuiSlider-thumb': {
                          width: 12,
                          height: 12,
                        },
                      }}  // Make the slider narrower
                    />
                  </div>
                )}
              </div>
            </Stack>
          </List>
        </Container>
      </Paper>
      <Dialog
        open={deleteDialogOpen}
        onClose={() => setDeleteDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Delete Configuration</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to delete this configuration? This action cannot be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)} color="primary">
            Cancel
          </Button>
          <Button
            onClick={() => {
              confirmDeleteConfig();
              setDeleteDialogOpen(false);
            }}
            color="secondary"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default SubsList;
