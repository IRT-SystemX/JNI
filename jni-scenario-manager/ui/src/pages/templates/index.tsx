import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Box, TextField, Typography, Container, InputAdornment, Snackbar, Alert } from '@mui/material';
import { useSearchParams } from 'react-router-dom';
import { styled } from '@mui/material/styles';
import SearchIcon from '@mui/icons-material/Search';
import { TemplateList } from '../../components/molecules/TemplateList';
import { CreateNewTemplateModalButton } from './CreateNewTemplateModalButton';

export type WorkflowTemplate = {
  name: string;
  description: string;
  code_block: string;
};

const StyledContainer = styled(Container)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
  '& .MuiOutlinedInput-root': {
    borderRadius: theme.shape.borderRadius,
  },
}));

function Templates() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchVal, setSearchVal] = useState(searchParams.get('q') || '');
  const [openNewTemplateModal, setOpenNewTemplateModal] = useState(false);
  const [openEditTemplateModal, setOpenEditTemplateModal] = useState(false);
  const [openDeleteTemplateModal, setOpenDeleteTemplateModal] = useState(false);
  const [data, setData] = useState<WorkflowTemplate[] | undefined>(undefined);
  const [error, setError] = useState<string | null>(null);
  const [openSnackbar, setOpenSnackbar] = useState(false);

  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    searchRef.current?.focus();
  }, []);

  const onSubmit = (value: string) => {
    setSearchParams({ q: value });
  };

  useEffect(() => {
    const baseUrlWorkflowManager = process.env.API_WORKFLOW_MANAGER_BASE_URL || 'localhost';
    fetch(`http://${baseUrlWorkflowManager}/api/v1/tasks/`)
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => {
        console.error('Fetching data failed', error);
        setError('Fetching data failed. Please try again.');
        setOpenSnackbar(true);
      });
  }, [openNewTemplateModal, openEditTemplateModal, openDeleteTemplateModal]);

  const filteredData = useMemo(() => {
    if (!data) return;
    return data.filter(item =>
      Object.values(item).some(value =>
        value.toLowerCase().includes(searchVal.toLowerCase())
      )
    );
  }, [data, searchVal]);

  const handleCloseSnackbar = () => {
    setOpenSnackbar(false);
  };

  return (
    <StyledContainer maxWidth="xl">
      <Typography variant="h4" sx={{ fontWeight: 300, mb: 1 }}>
        Workflow & Tasks Templates
      </Typography>
      <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary' }}>
        Manage and search your workflow templates
      </Typography>

      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <StyledTextField
          placeholder="Search Template/Task"
          variant="outlined"
          fullWidth
          inputRef={searchRef}
          value={searchVal}
          onChange={(e) => setSearchVal(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && searchVal) {
              onSubmit(searchVal);
            }
          }}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mr: 2 }}
        />
        <CreateNewTemplateModalButton
          key="new-template"
          buttonContent="New Template"
          open={openNewTemplateModal}
          setOpen={setOpenNewTemplateModal}
        />
      </Box>

      <Box sx={{ flexGrow: 1 }}>
        {filteredData ? (
          <TemplateList
            openDeleteModal={openDeleteTemplateModal}
            setOpenDeleteModal={setOpenDeleteTemplateModal}
            setOpenModal={setOpenEditTemplateModal}
            openModal={openEditTemplateModal}
            workflowTemplateList={filteredData}
          />
        ) : (
          <Typography variant="body1" color="text.secondary" align="center">
            Loading...
          </Typography>
        )}
      </Box>

      <Snackbar
        open={openSnackbar}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
      >
        <Alert onClose={handleCloseSnackbar} severity="error" sx={{ width: '100%' }}>
          {error}
        </Alert>
      </Snackbar>
    </StyledContainer>
  );
}

export default Templates;
