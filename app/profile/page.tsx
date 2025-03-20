"use client";

import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { Container, Typography, Paper, Box, Avatar, Divider, Grid, Skeleton } from '@mui/material';
import NavBar from '../components/common/NavBar';
import Footer from '../components/common/Footer';

const Profile = () => {
  const { user, isLoggedIn } = useAuth();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading user data
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  if (!isLoggedIn) {
    return (
      <div className='bg-green-200 h-screen'>
        <NavBar />
        <Container maxWidth="md" sx={{ py: 4 }}>
          <Paper elevation={3} sx={{ p: 4, textAlign: 'center' }}>
            <Typography variant="h5" component="h1" gutterBottom>
              Please log in to view your profile
            </Typography>
          </Paper>
        </Container>
        <Footer />
      </div>
    );
  }

  return (
    <div className='bg-green-200 h-screen pt-20'>
      <NavBar />
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom align="center">
            Profile Page
          </Typography>
          <Divider sx={{ my: 2 }} />

          <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'row' }, alignItems: { xs: 'center', md: 'flex-start' }, mb: 4 }}>
            {loading ? (
              <Skeleton variant="circular" width={120} height={120} />
            ) : (
              <Avatar
                sx={{ width: 120, height: 120, mb: { xs: 2, md: 0 }, mr: { md: 4 } }}
                alt={user?.displayName || "User"}
                src="/placeholder-avatar.jpg"
              />
            )}
            
            <Box sx={{ flexGrow: 1 }}>
              {loading ? (
                <>
                  <Skeleton variant="text" width="60%" height={40} />
                  <Skeleton variant="text" width="40%" height={30} />
                </>
              ) : (
                <>
                  <Typography variant="h5" gutterBottom>
                    {user?.displayName || "User Name"}
                  </Typography>
                  <Typography variant="body1" color="text.secondary" gutterBottom>
                    {user?.email || "user@example.com"}
                  </Typography>
                </>
              )}
            </Box>
          </Box>

          <Divider sx={{ my: 2 }} />
          
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6" gutterBottom>
                Account Information
              </Typography>
              {loading ? (
                <>
                  <Skeleton variant="text" width="100%" height={30} />
                  <Skeleton variant="text" width="100%" height={30} />
                  <Skeleton variant="text" width="100%" height={30} />
                </>
              ) : (
                <>
                  <Typography variant="body1" gutterBottom>
                    <strong>Member since:</strong> {new Date().toLocaleDateString()}
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Account type:</strong> Standard
                  </Typography>
                  <Typography variant="body1" gutterBottom>
                    <strong>Last login:</strong> {new Date().toLocaleString()}
                  </Typography>
                </>
              )}
            </Grid>
          </Grid>
        </Paper>
      </Container>
      <Footer />
    </div>
  );
};

export default Profile;