import * as React from 'react';
import { styled } from '@mui/system';
import { Tabs } from '@mui/base/Tabs';
import { TabsList as BaseTabsList } from '@mui/base/TabsList';
import { TabPanel as BaseTabPanel } from '@mui/base/TabPanel';
import { buttonClasses } from '@mui/base/Button';
import { Tab as BaseTab, tabClasses } from '@mui/base/Tab';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ArrowBackIos from '@mui/icons-material/ArrowBackIos';
import ArrowForwardIos from '@mui/icons-material/ArrowForwardIos';
import Typography from '@mui/material/Typography';
import SubsList from './SubsList';
import { useConfigContext } from '../hooks/useConfigContext';
import { Button } from '@mui/material';

const ConfigSwitch = () => {
  const { configs, selected, dispatch } = useConfigContext();
  const [visibleRange, setVisibleRange] = React.useState({ start: 0, end: 3 });
  const [selectedTab, setSelectedTab] = React.useState(selected ? selected.id : null);

  const [tabs, setTabs] = React.useState(configs || []);

  React.useEffect(() => {
    console.log("Use effect was called in tabs list");
    setTabs(configs || []);
  }, [ dispatch, configs, setTabs]);

  React.useEffect(() => {
    if (selected) {
      setSelectedTab(selected.id);
    }
  }, [selected]);

  const handlePrev = () => {
    setVisibleRange(prev => ({
      start: Math.max(prev.start - 1, 0),
      end: Math.max(prev.end - 1, 3),
    }));
  };

  const handleNext = () => {
    setVisibleRange(prev => ({
      start: Math.min(prev.start + 1, tabs.length - 3),
      end: Math.min(prev.end + 1, tabs.length),
    }));
  };

  const handleTabChange = (event, newValue) => {
    const newSelectedTab = tabs.find(tab => tab.id === newValue);
    if (newSelectedTab) {
      dispatch({ type: 'SET_SELECTED', payload: newSelectedTab });
    }
  };

  const createNewConfig = async () => {
      // make patch request to update the config
      const response = await fetch(`${process.env.REACT_APP_BACKEND_URL}/config/add`, {
        method: 'POST',
        body: JSON.stringify({ name: 'New Config', subs: [] }),
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const json = await response.json();
      dispatch({ type: 'CREATE_CONFIG', payload: json });
  }

  const visibleTabs = tabs.slice(visibleRange.start, visibleRange.end);

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
        <ConfigTabs value={selectedTab} onChange={handleTabChange}>
          <ConfigsTitle sx={{ position: 'relative', width: '100%'}}>
            Configs
            <Button variant="contained" sx={
              { position: 'absolute', right: '10px', top: '10px', color: '#292929', padding: '8px', backgroundColor: 'white'}
            } onClick={() => createNewConfig()}>
              New Config
            </Button>
          </ConfigsTitle>
          
          <TabsList>
            <StyledIconButton onClick={handlePrev} disabled={visibleRange.start === 0}>
                <ArrowBackIos />
            </StyledIconButton>
            {visibleTabs.map(tab => (
              <Tab key={tab.id} value={tab.id}>{tab.name}</Tab>
            ))}    
            <StyledIconButton onClick={handleNext} disabled={visibleRange.end >= tabs.length}>
                <ArrowForwardIos />
            </StyledIconButton>
          </TabsList>
          {tabs.map(tab => (
            <TabPanel key={tab.id} value={tab.id}>
                <SubsList key={tab.id}/>
            </TabPanel>
          ))}
        </ConfigTabs> 
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

const ConfigTabs = styled(Tabs)`
  width: 90%;
  display: flex;
  flex-direction: column;
`;

const Tab = styled(BaseTab)`
  font-family: 'IBM Plex Sans', sans-serif;
  color: white;
  cursor: pointer;
  font-size: 0.875rem;
  font-weight: bold;
  background-color: transparent;
  width: 100%;
  line-height: 1.5;
  padding: 8px 12px;
  margin: 6px;
  border: none;
  border-radius: 8px;
  display: flex;
  justify-content: center;

  &:hover {
    background-color: ${palette[400]};
  }

  &:focus {
    color: #fff;
    outline: 3px solid ${palette[200]};
  }

  &.${tabClasses.selected} {
    background-color: #fff;
    color: ${palette[600]};
  }

  &.${buttonClasses.disabled} {
    opacity: 0.5;
    cursor: not-allowed;
  }
`;

const TabPanel = styled(BaseTabPanel)`
  width: 100%;
  font-family: 'IBM Plex Sans', sans-serif;
  font-size: 0.875rem;
`;

const TabsList = styled(BaseTabsList)(
  ({ theme }) => `
  width: 100%;
  background-color: ${palette[500]};
  margin: 0 0 10px 0;
  border-radius: 0 0 8px 8px;
  display: flex;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  box-shadow: 0px 4px 6px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.4)' : 'rgba(0,0,0, 0.2)'
  };
  `,
);

const ConfigsTitle = styled(Typography)(
  ({ theme }) => `
  font-family: 'IBM Plex Sans', sans-serif;
  color: white;
  font-size: 1rem;
  font-weight: bold;
  width: 100%;
  background-color: ${palette[700]};
  margin: 10px 0 0 0;
  padding: 20px 0px;
  border-radius: 8px 8px 0 0;
  display: flex;
  color: white;
  align-items: center;
  justify-content: center;
  align-content: space-between;
  
  box-shadow: 0px 4px 6px ${
    theme.palette.mode === 'dark' ? 'rgba(0,0,0, 0.4)' : 'rgba(0,0,0, 0.2)'
  };

  position: relative;
  
  &::after {
    content: '';
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px; /* Adjust the height as needed */
    background-color: white;
    border-radius: 0 0 8px 8px; /* Match the bottom border radius if needed */
  }
  `,
);

const StyledIconButton = styled(IconButton)`
  color: white;
  background-color: transparent;
  border-radius: 8px;
  margin: 6px;

  &:hover {
    background-color: ${palette[400]};
  }

  &:focus {
    color: #fff;
    outline: 3px solid ${palette[200]};
  }

  &:disabled {
    opacity: 0.5;
    color: white;
    cursor: not-allowed;
  }
`;