import * as React from 'react';
import {
  Avatar,
  Button,
  Container,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemButton,
  ListItemText,
  Paper,
  Slider,
  Stack,
  TextField,
  Tooltip,
} from '@mui/material';
import { Delete as DeleteIcon, Edit as EditIcon, Check as CheckIcon, Close as CloseIcon } from '@mui/icons-material';
import { useConfigContext } from '../hooks/useConfigContext';
import { useAuthContext } from '../hooks/useAuthContext';
import DefaultSwitch from './DefaultSwitch';
import FinnhubSearch from './FinnhubSearch';
import IconSearch from './IconSearch';

const SubsList = () => {
  const { configs, selected, dispatch } = useConfigContext();
  const { user } = useAuthContext();

  const [editIndex, setEditIndex] = React.useState(null);
  const [editValue, setEditValue] = React.useState('');
  const [newSubName, setNewSubName] = React.useState('');
  const [newSubApiName, setNewSubApiName] = React.useState('');
  const [newSubLogoName, setNewSubLogoName] = React.useState('');
  const [showNewSubField, setShowNewSubField] = React.useState(false);
  const [editConfigName, setEditConfigName] = React.useState(false);
  const [configNameValue, setConfigNameValue] = React.useState('');
  const [submenuIndex, setSubmenuIndex] = React.useState(null);
  const [config, setConfig] = React.useState(selected);
  const [submenuChanges, setSubmenuChanges] = React.useState({});
  const [deleteDialogOpen, setDeleteDialogOpen] = React.useState(false);

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
      dispatch({ type: 'U' });

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

  const handleAddNew = async () => {
    if (newSubName && newSubApiName) {
      await updateConfig({
        ...config,
        subs: [...config.subs, newSubName],
        api_names: [...config.api_names, newSubApiName],
        logo_names: [...config.logo_names, newSubLogoName || ''],
      });
      setShowNewSubField(false);
      setNewSubName('');
      setNewSubApiName('');
      setNewSubLogoName('');
    }
  };

  const handleConfigNameEdit = () => {
    setEditConfigName(true);
  };

  const handleConfigNameSave = async () => {
    await updateConfig({ ...config, name: configNameValue });
    setEditConfigName(false);
  };

  // Handle changes in the submenu fields
  const handleSubmenuChange = (index, field, value) => {
    setSubmenuChanges((prevChanges) => ({
      ...prevChanges,
      [index]: {
        ...prevChanges[index],
        [field]: value || '', // Update only the specific field (apiName or logoName)
      },
    }));
  };

  // Handle saving and closing the submenu, ensuring both arrays are in sync
  const handleSubmenuClose = (index) => {
    const { apiName, logoName } = submenuChanges[index] || {};
    const newApiNames = [...config.api_names];
    const newLogoNames = [...config.logo_names];

    if (apiName !== undefined) {
      newApiNames[index] = apiName;
    }
    if (logoName !== undefined) {
      newLogoNames[index] = logoName;
    }

    updateConfig({
      ...config,
      api_names: newApiNames,
      logo_names: newLogoNames,
    });

    // Close the submenu by setting the index to null
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

  const paperStyle = { padding: '20px', width: '90%', margin: '20px auto' };

  return (
    <Container>
      <Paper elevation={3} style={paperStyle}>
        <div
          style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            border: '1px solid black',
            borderRadius: '10px',
            backgroundColor: '#292929',
            marginBottom: '20px',
            color: 'white',
            padding: '10px',
            position: 'relative',
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
              style={{ position: 'absolute', right: '15px', top: '60px' }}
            >
              <DeleteIcon style={{ color: '#DC143C' }} />
            </IconButton>
          </Tooltip>
          {editConfigName ? (
            <IconButton
              edge="end"
              aria-label="save"
              onClick={handleConfigNameSave}
              style={{ position: 'absolute', right: '15px', top: '30px' }}
            >
              <CheckIcon style={{ color: 'white' }} />
            </IconButton>
          ) : (
            <Tooltip title="Edit Config Name" arrow>
              <IconButton
                edge="end"
                aria-label="edit"
                onClick={handleConfigNameEdit}
                style={{ position: 'absolute', right: '15px', top: '30px' }}
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
                          <IconButton edge="end" aria-label="save" onClick={
                            () => {
                              handleSave();
                              handleSubmenuClose(index)
                            }
                            }>
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
                    style={{ borderLeft: '4px solid red', marginTop: '10px' }}
                  >
                    <ListItemButton onClick={() => setSubmenuIndex(submenuIndex === index ? null : index)}>
                      <ListItemAvatar>
                        <Avatar
                          alt={`Avatar ${config.logo_names[index]}`}
                          src={config.logo_names[index] ? `https://financialmodelingprep.com/image-stock/${config.logo_names[index]}.png` : undefined}
                        />
                      </ListItemAvatar>
                      {editIndex === index ? (
                        <TextField
                          value={editValue}
                          onChange={(e) => setEditValue(e.target.value)}
                          onClick={(e) => e.stopPropagation()}
                          sx={{ marginRight: '30px' }}
                        />
                      ) : (
                        <ListItemText id={labelId} primary={`${value}`} />
                      )}
                    </ListItemButton>
                  </ListItem>
                  {submenuIndex === index && (
                    <div style={{ padding: '10px 20px' }}>
                      <Grid container spacing={2}>
                        <Grid item xs={12} sm={6}>
                          <FinnhubSearch
                            fullWidth
                            placeholder="API subscription search"
                            margin="dense"
                            defaultValue={submenuChanges[index]?.apiName || ''}
                            onChange={(value) => handleSubmenuChange(index, 'apiName', value)}
                          />
                        </Grid>
                        <Grid item xs={12} sm={6}>
                          <IconSearch
                            fullWidth
                            placeholder="Logo search"
                            margin="dense"
                            defaultValue={submenuChanges[index]?.logoName || ''}
                            onChange={(value) => handleSubmenuChange(index, 'logoName', value)}
                          />
                        </Grid>
                        <Grid item xs={12}>
                          <Button variant="contained" onClick={() => handleSubmenuClose(index)}>
                            Save
                          </Button>
                        </Grid>
                      </Grid>
                    </div>
                  )}
                </div>
              );
            })}

            <Stack spacing={2} direction="column" alignItems="center" marginTop="20px">
              {showNewSubField && (
                <Container>
                  <TextField
                    margin="dense"
                    placeholder="Subscription name"
                    value={newSubName}
                    onChange={(e) => setNewSubName(e.target.value)}
                    fullWidth
                  />
                  <Grid container spacing={2}>
                    <Grid item xs={12} sm={6}>
                      <FinnhubSearch
                        margin="dense"
                        placeholder="Finnhub search"
                        onChange={(apiName) => setNewSubApiName(apiName)}
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <IconSearch
                        margin="dense"
                        placeholder="Logo search"
                        onChange={(logoName) => setNewSubLogoName(logoName)}
                        sx={{ width: '100%' }}
                      />
                    </Grid>
                  </Grid>
                </Container>
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
                  <div style={{ marginTop: '20px', textAlign: 'center' }}>
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
                      }}
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
