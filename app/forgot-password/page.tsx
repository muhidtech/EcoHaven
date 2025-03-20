'use client';

import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Paper, Alert } from '@mui/material';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic email validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address');
      return;
    }
    
    // In a real application, this would call an API to send a password reset email
    // For now, we'll just simulate a successful submission
    setIsSubmitted(true);
    setError('');
  };

  return (
    <Container maxWidth="sm">
      <Box sx={{ mt: 8, mb: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" align="center" gutterBottom>
            Forgot Password
          </Typography>
          
          {!isSubmitted ? (
            <>
              <Typography variant="body1" sx={{ mb: 3 }}>
                Please enter your email address below. We will send you instructions to reset your password.
              </Typography>
              
              {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
              
              <form onSubmit={handleSubmit}>
                <TextField
                  label="Email Address"
                  type="email"
                  fullWidth
                  margin="normal"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                
                <Button
                  type="submit"
                  fullWidth
                  variant="contained"
                  color="primary"
                  sx={{ mt: 3, mb: 2 }}
                >
                  Reset Password
                </Button>
              </form>
            </>
          ) : (
            <Alert severity="success">
              If an account exists with the email {email}, you will receive password reset instructions shortly.
            </Alert>
          )}
        </Paper>
      </Box>
    </Container>
  );
};

export default ForgotPassword;