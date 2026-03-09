import React from 'react';
import { Box, Paper, Typography, Avatar, Divider, Button } from '@mui/material';
import { useAuth } from '../../context/AuthProvider';
import PersonIcon from '@mui/icons-material/Person';
import SecurityIcon from '@mui/icons-material/Security';
import EmailIcon from '@mui/icons-material/Email';

/**
 * ProfileView — shows the currently logged-in user's details.
 */
export default function ProfileView({ onBack }) {
  const { user } = useAuth();

  if (!user) return null;

  return (
    <Box sx={{ p: 4, display: 'flex', justifyContent: 'center' }}>
      <Paper elevation={3} sx={{ p: 4, maxWidth: 500, width: '100%', borderRadius: 3 }}>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 3 }}>
          <Avatar sx={{ width: 80, height: 80, bgcolor: 'primary.main', mb: 2 }}>
            <PersonIcon fontSize="large" />
          </Avatar>
          <Typography variant="h5" fontWeight="bold">
            {user.displayName || 'Anonymous User'}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Account ID: {user.id}
          </Typography>
        </Box>

        <Divider sx={{ mb: 3 }} />

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
          <Box>
            <Typography variant="caption" display="block" color="text.secondary">
              Email Address
            </Typography>
            <Typography variant="body1">{user.email}</Typography>
          </Box>
        </Box>

        <Box sx={{ display: 'flex', alignItems: 'center', mb: 3 }}>
          <SecurityIcon sx={{ mr: 2, color: 'text.secondary' }} />
          <Box>
            <Typography variant="caption" display="block" color="text.secondary">
              Role
            </Typography>
            <Typography variant="body1" sx={{ fontWeight: 600, color: 'primary.main' }}>
              {user.role}
            </Typography>
          </Box>
        </Box>

        <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
          <Button variant="outlined" fullWidth onClick={onBack}>
            Back to Hub
          </Button>
        </Box>
      </Paper>
    </Box>
  );
}
