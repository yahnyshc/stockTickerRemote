import * as React from 'react';
import { styled } from '@mui/system';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import SubsList from './SubsList';
import { useConfigContext } from '../hooks/useConfigContext';
import NewConfigButton from './NewConfigButton';
import { useAuthContext } from '../hooks/useAuthContext';
import { useTheme } from '@mui/material/styles';

const ConfigSwitch = () => {
  const { configs, selected, dispatch } = useConfigContext();
  const [selectedTab, setSelectedTab] = React.useState(selected ? selected.id : null);
  const [tabs, setTabs] = React.useState(configs || []);
  const [tabWidth, setTabWidth] = React.useState(0);
  const theme = useTheme();
  const tabsRef = React.useRef(null)
  const { user } = useAuthContext();

  React.useEffect(() => {
    if (!user) {
      return;
    }
    console.log("Use effect was called in tabs list");
    setTabs(configs || []);
  }, [dispatch, configs, setTabs, user]);

  React.useEffect(() => {
    if (!user) {
      return;
    }
    if (selected) {
      setSelectedTab(selected.id);
    }
  }, [selected, user]);

  React.useEffect(() => {
    const handleResize = () => {
      if (tabsRef.current) {
        const parentWidth = tabsRef.current.clientWidth;
        const newTabWidth = parentWidth / tabs.length;
        setTabWidth(newTabWidth);
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, [tabs.length]);

  const handleTabChange = (event, newValue) => {
    const newSelectedTab = tabs.find(tab => tab.id === newValue);
    if (newSelectedTab) {
      dispatch({ type: 'SET_SELECTED', payload: newSelectedTab });
    }
  };

  const createNewConfig = async () => {
    if (!user || !user.id || !user.token) {
      console.error("User is not authenticated");
      return;
    }
  
    const configData = {
      name: 'New Config',
      subs: [],
      api_names: [],
      logo_names: [],
      switch_time: 5
    };
  
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/config/add?userId=${user.id}`, {
        method: 'POST',
        body: JSON.stringify(configData),
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${user.token}`
        },
      });
  
      const json = await response.json();
  
      if (response.ok) {
        dispatch({ type: 'CREATE_CONFIG', payload: json });
      } else {
        console.error("Failed to create new config:", json);
      }
    } catch (error) {
      console.error("An error occurred while creating new config:", error);
    }
  };

  return (
    <Box 
        sx={{ 
            display: 'flex', 
            alignItems: 'center', 
            width: '100%', 
            justifyContent: 'center',
            flexDirection: 'column',
            marginTop: '20px'
    }}>
        <ConfigsTitle sx={{ width: '90%' }}>
            <h3 style={{ margin: '0px' }}>Configs</h3>
            <NewConfigButton onClick={() => createNewConfig()} />
        </ConfigsTitle>
        <Box sx={{ display: 'flex', justifyContent: 'center', width: '90%' }}>
          <div style={{ width: '100%' }}>
            <Tabs
              ref={tabsRef}
              value={selectedTab}
              onChange={handleTabChange}
              variant="scrollable"
              scrollButtons="auto"
              aria-label="scrollable prevent tabs example"
              sx={{ 
                '.MuiTabs-scroller': {
                  borderBottom: `1px solid ${theme.palette.grey[50]}`,
                },
                '.MuiTab-root': {
                  textTransform: 'none',
                  minWidth: `${tabWidth}px`,
                  maxWidth: `${tabWidth}px`,
                },
                '.Mui-selected': {
                  color: `${theme.palette.primary[400]} !important`,
                  fontWeight: 'bold',
                },
                '.MuiTabs-indicator': {
                  backgroundColor: theme.palette.primary[400],
                },
              }}
            >
              {tabs.map((tab) => (
                <Tab key={tab.id} label={tab.name} value={tab.id}/>
              ))}
            </Tabs>
          </div>
        </Box>
        {tabs.map(tab => (
          <TabPanel key={tab.id} value={selectedTab} selectedTab={tab.id}>
            <SubsList key={tab.id}/>
          </TabPanel>
        ))}
    </Box>
  );
}

export default ConfigSwitch;

const palette = {
  50: '#e0e0e0',
  100: '#b3b3b3',
  200: '#808080',
  300: '#666666',
  400: '#212121',
  500: '#3b3b3b',
  600: '#333333',
  700: '#292929',
  800: '#1f1f1f',
  900: '#141414',
};

const ConfigsTitle = styled(Typography)(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  width: 100%;
  background-color: ${palette[700]};
  margin: 0px 0 0 0;
  padding: 20px 0px;
  border-radius: 8px 8px 0 0;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  
  box-shadow: 0px 4px 6px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.4)' : 'rgba(0,0,0, 0.2)'
  };
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: white;
    border-radius: 0 0 8px 8px;
  }
  `,
);

const TabPanel = ({ children, value, selectedTab }) => {
  return (
    <div role="tabpanel" hidden={value !== selectedTab} style={{ width: '100%' }}>
      {value === selectedTab && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );
};
