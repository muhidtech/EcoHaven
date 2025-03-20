
import React from 'react';
import { Container, Typography, Paper, Box, Divider } from '@mui/material';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';

const SettingsPage = () => {
  return (
    <div className='h-screen pt-20 bg-green-200'>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Settings Page
          </Typography>
          <Divider sx={{ mb: 3 }} />
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Account Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your account preferences, notification settings, and privacy options.
            </Typography>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Notification Preferences
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Control which notifications you receive and how they are delivered.
            </Typography>
          </Box>
          
          <Box sx={{ mb: 4 }}>
            <Typography variant="h6" gutterBottom>
              Privacy & Security
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Manage your privacy settings and security options to keep your account safe.
            </Typography>
          </Box>
          
          <Box>
            <Typography variant="h6" gutterBottom>
              Display Settings
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Customize your display preferences for the best experience.
            </Typography>
          </Box>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default SettingsPage;