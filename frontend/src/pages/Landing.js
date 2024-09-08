import { Typography, Paper, Grid, Link } from '@mui/material';
import { useMediaQuery, useTheme } from '@mui/material'; // Import necessary hooks
import Auth from "../components/Auth.js";

const Landing = () => {
  const theme = useTheme();
  const isDesktop = useMediaQuery(theme.breakpoints.up('md')); // Check if the screen width is >= 900px (md breakpoint)

  return (
    <Grid container spacing={4} style={{ padding: '20px 5%', background: 'linear-gradient(135deg, #ece9e6, #ffffff)' }}>
      {/* Left Side - GIF and Project Description */}
      <Grid item xs={12} md={isDesktop ? 7 : 12} style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        <Paper elevation={6} style={{ padding: '20px 30px', textAlign: 'center', borderRadius: '20px', backgroundColor: '#f7f7f7' }}>
          <img
            src="stockticker.gif" // Replace with your GIF URL
            alt="Physical Stock Ticker"
            style={{ width: '90%', maxHeight: '400px', objectFit: 'cover', borderRadius: '16px', marginBottom: '20px' }}
          />
          <Typography variant="h5" style={{ fontWeight: 700, color: '#222', marginBottom: '20px' }}>
            Stock Ticker Project
          </Typography>
          <Typography variant="body1" style={{ color: '#444', fontSize: '14px', lineHeight: '1.8', marginBottom: '15px' }}>
            The Stock Ticker project lets you track real-time stock market data using a physical device connected to your home network. It leverages APIs like Finnhub to fetch stock prices and display them on the ticker device.
          </Typography>
          <Typography variant="body1" style={{ color: '#444', fontSize: '14px', lineHeight: '1.8', marginBottom: '15px' }}>
            Configure the stocks, ETFs, cryptocurrencies, and more that you want to track, change the switch speed, and even customize the stocks logos displayed on the physical ticker. Stay updated with live stock market data displayed right at your desk!
          </Typography>
          <Link href="https://github.com/yahnyshc/stockTicker" target="_blank" rel="noopener" underline="hover" style={{ fontSize: '16px', fontWeight: 600, color: '#1e88e5' }}>
            View Project on GitHub
          </Link>
        </Paper>
      </Grid>

      {/* Right Side - Login/Signup Toggle */}
      {isDesktop && ( // Only show login/signup form if screen width is >= 900px
        <Grid item xs={12} md={5} style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            <Paper elevation={6} style={{ padding: '40px', borderRadius: '20px', backgroundColor: '#ffffff' }}>
                <Auth />
            </Paper>
        </Grid>
      )}
    </Grid>
  );
};

export default Landing;
