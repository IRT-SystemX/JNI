import React, { useState } from 'react';
import {
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Tooltip,
  Autocomplete,
  Snackbar,
  CircularProgress,
} from '@mui/material';
import MuiAlert from '@mui/material/Alert';
import { ParamObject } from './types/AASTypes';

type SemanticId = {
  keys: {
    type: string;
    value: string;
  }[];
  type: string;
};

type PropertyObject = {
  modelType: string;
  value: string;
  valueType: string;
  category: string;
  idShort: string;
  semanticId: SemanticId;
};

type Props = {
  workflowName: string;
  workflowExecutionDate: string;
  aasName: string;
  aasElement: PropertyObject;
  aasElementSubModelId: string;
  simulationParamsObjects: ParamObject[];
};



async function patchSubmodelValue(
  workflowName: string,
  workflowExecutionDate: string,
  aasName: string,
  aasElementName: string,
  aasElementSubModelId: string,
  value: string,
  userId: string
): Promise<Response> {
  const baseUrlSubmodelApi = process.env.API_SUBMODEL_BASE_URL || 'localhost';
  const endpoint = `http://${baseUrlSubmodelApi}/submodels/${aasElementSubModelId}/submodel-elements/${aasElementName}/$value`;
  const requestOptions: RequestInit = {
    method: 'PATCH',
    headers: {
      'Content-Type': 'application/json',
    },
    body: '"'+value+'"',
  };

  try {
    const response = await fetch(endpoint, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    // If the patch was successful, record the operation
    await recordSuccessfulPatch(workflowName, workflowExecutionDate, aasName, aasElementName, userId);

    return response;
  } catch (error) {
    console.error('Error during the fetch request:', error);
    throw error;
  }
}

async function recordSuccessfulPatch(
  workflowName: string,
  workflowExecutionDate: string,
  aasName: string,
  aasElementName: string,
  userId: string,
): Promise<void> {

  const baseUrlWorkflowManager = process.env.API_WORKFLOW_MANAGER_BASE_URL || 'localhost';
  const archiveEndpoint = `http://${baseUrlWorkflowManager}/api/v1/archive-items/`;
  const currentDate = new Date().toISOString();

  const archiveData = {
    workflow_execution_id: generateUniqueId(), // You need to implement this function
    workflow_name: workflowName,
    aas_name: aasName,
    property_name: aasElementName,
    workflow_execution_date: workflowExecutionDate,
    updated_date: currentDate,
    user_id: userId,
  };

  const requestOptions: RequestInit = {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(archiveData),
  };

  try {
    const response = await fetch(archiveEndpoint, requestOptions);
    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error recording successful patch:', error);
    // Note: We're not throwing the error here to avoid affecting the main operation
  }
}

// Helper function to generate a unique ID (you may want to use a more robust method)
function generateUniqueId(): string {
  return Date.now().toString(36) + Math.random().toString(36).substr(2);
}

export const AASElementDetailsCard = ({ workflowName, workflowExecutionDate,  aasName, aasElement, aasElementSubModelId, simulationParamsObjects }: Props) => {
  const [newValue, setNewValue] = useState('');
  const [loading, setLoading] = useState(false);
  const [snackbar, setSnackbar] = useState({
    open: false,
    message: '',
    severity: 'success' as 'success' | 'error',
  });

  const handleUpdateValue = async () => {
    setLoading(true);
    try {
      console.log('element', aasElement)
      const userId = 'test_user'; // TODO: Replace with actual user ID
      await patchSubmodelValue(workflowName, workflowExecutionDate, aasName, aasElement.idShort, aasElementSubModelId, newValue, userId);
      setSnackbar({
        open: true,
        message: 'Value updated successfully!',
        severity: 'success',
      });
    } catch (error) {
      setSnackbar({
        open: true,
        message: `Failed to update value ${newValue} for ${aasElement.idShort}. Please try again.`,
        severity: 'error',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCloseSnackbar = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbar({ ...snackbar, open: false });
  };

  return (
    <Box
      sx={{
        background: '#ffffff',
        borderRadius: '8px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.05)',
        overflow: 'hidden',
      }}
    >
      <Box
        sx={{
          borderBottom: '1px solid #e0e0e0',
          p: 2,
        }}
      >
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>
          {aasElement.idShort}
        </Typography>
      </Box>

      <Box sx={{ p: 2 }}>
        <Grid container spacing={2}>
          {['modelType', 'valueType', 'category', 'idShort'].map((field) => (
            <Grid item xs={6} key={field}>
              <Box sx={{ mb: 1 }}>
                <Typography variant="caption" sx={{ color: '#6c757d', fontWeight: 500 }}>
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </Typography>
                <Tooltip title={aasElement?.[field] || 'N/A'} arrow>
                  <Typography
                    variant="body2"
                    sx={{
                      fontWeight: 500,
                      color: '#2c3e50',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      cursor: 'default'
                    }}
                  >
                    {aasElement?.[field] || 'N/A'}
                  </Typography>
                </Tooltip>
              </Box>
            </Grid>
          ))}
        </Grid>

        {aasElement && !Array.isArray(aasElement.value) && (
          <Box sx={{ mt: 2 }}>
            <Typography variant="caption" sx={{ color: '#6c757d', fontWeight: 500 }}>
              Value
            </Typography>
            <Typography variant="body2" sx={{ fontWeight: 500, color: '#2c3e50' }}>
              {aasElement?.value}
            </Typography>
          </Box>
        )}

        <Box sx={{ mt: 2 }}>
          <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2c3e50', mb: 1 }}>
            Semantic ID
          </Typography>
          <Box
            sx={{
              display: 'flex',
              overflowX: 'auto',
              pb: 1,
              '&::-webkit-scrollbar': {
                height: '6px',
              },
              '&::-webkit-scrollbar-thumb': {
                backgroundColor: 'rgba(0,0,0,.2)',
                borderRadius: '3px',
              },
              '&::-webkit-scrollbar-track': {
                backgroundColor: 'rgba(0,0,0,.05)',
              },
            }}
          >
            <Box sx={{ display: 'flex', gap: 1 }}>
              {aasElement.semanticId?.keys && aasElement.semanticId.keys.map((key, index) => (
                <Box
                  key={index}
                  sx={{
                    background: '#f8f9fa',
                    borderRadius: '4px',
                    p: 1,
                    minWidth: '120px',
                    border: '1px solid #e0e0e0',
                  }}
                >
                  <Typography variant="caption" sx={{ color: '#6c757d', fontWeight: 500, display: 'block' }}>
                    {key.type ?? 'N/A'}
                  </Typography>
                  <Typography variant="body2" sx={{ fontWeight: 500, color: '#2c3e50', wordBreak: 'break-all' }}>
                    {key.value ?? 'N/A'}
                  </Typography>
                </Box>
              ))}
            </Box>
          </Box>
        </Box>

        {aasElement?.modelType.toLowerCase() === "property" && (
          <Box mt={2}>
            <Typography variant="subtitle2" sx={{ fontWeight: 600, color: '#2c3e50', mb: 1 }}>
              Update Value
            </Typography>
            <Box sx={{ display: "flex", gap: 1, alignItems: 'center', width: '100%'}}>
              <Autocomplete
                options={simulationParamsObjects}
                getOptionLabel={(option) => option.value}
                value={simulationParamsObjects.find((option) => option.value === newValue) || null}
                sx={{width: '100%'}}
                freeSolo={true}
                onChange={(event, newValue) => {
                  setNewValue(newValue ? newValue.value : '');
                }}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    size="small"
                    fullWidth
                    label="Choose a new value"
                    onChange={(e) => {
                      setNewValue(e.target.value);
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: '4px',
                      },
                    }}
                  />
                )}
                renderOption={(props, option) => (
                  <li {...props} key={option.value}>
                    {option.paramName}: {option.value}
                  </li>
                )}
              />
              <Button
                size="small"
                variant="contained"
                onClick={handleUpdateValue}
                disabled={loading}
                sx={{
                  borderRadius: '4px',
                  textTransform: 'none',
                  fontWeight: 600,
                  boxShadow: 'none',
                  backgroundColor: '#4facfe',
                  '&:hover': {
                    backgroundColor: '#2196f3',
                  },
                }}
              >
                {loading ? <CircularProgress size={24} color="inherit" /> : 'Update'}
              </Button>
            </Box>
          </Box>
        )}
      </Box>

      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      >
        <MuiAlert
          elevation={6}
          variant="filled"
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
        >
          {snackbar.message}
        </MuiAlert>
      </Snackbar>
    </Box>
  );
};
