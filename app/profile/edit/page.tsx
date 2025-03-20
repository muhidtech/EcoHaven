"use client";

import React from "react";
import { Container, Typography, Box, Paper } from "@mui/material";

const EditProfilePage: React.FC = () => {
  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Paper elevation={3} sx={{ p: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Profile Page
          </Typography>
          <Typography variant="body1" paragraph>
            This page allows you to edit your profile information. You can update your personal details, 
            preferences, and other account settings here.
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Profile editing functionality will be implemented soon.
          </Typography>
        </Paper>
      </Box>
    </Container>
  );
};

export default EditProfilePage;