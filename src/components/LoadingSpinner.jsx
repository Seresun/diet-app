import React from 'react';
import { CircularProgress, Box, Typography } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function LoadingSpinner({ message }) {
  const { t } = useTranslation();
  
  return (
    <Box 
      display="flex" 
      flexDirection="column" 
      alignItems="center" 
      justifyContent="center" 
      minHeight="200px"
    >
      <CircularProgress size={40} />
      <Typography variant="body1" style={{ marginTop: '1rem', color: '#666' }}>
        {message || t('loading')}
      </Typography>
    </Box>
  );
}
