import React from 'react';
import { Alert, Box, Button } from '@mui/material';
import { useTranslation } from 'react-i18next';

export default function ErrorMessage({ error, onRetry }) {
  const { t } = useTranslation();
  
  return (
    <Box display="flex" flexDirection="column" alignItems="center" minHeight="200px">
      <Alert severity="error" style={{ marginBottom: '1rem' }}>
        {error || t('error.loading')}
      </Alert>
      {onRetry && (
        <Button variant="contained" onClick={onRetry}>
          {t('retry')}
        </Button>
      )}
    </Box>
  );
}
