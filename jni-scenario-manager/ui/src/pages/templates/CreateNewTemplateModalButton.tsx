import React, { useEffect, useState } from "react";
import { Box, Button, Grid, TextField, Typography, Modal, IconButton, Tooltip, Snackbar, Alert } from "@mui/material";
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faFileUpload, faFloppyDisk, faPenToSquare, faXmark } from "@fortawesome/free-solid-svg-icons";
import DAGEditor from "../../components/atoms/DAGEditor";
import DAGDefinition from "../../components/molecules/DAGDefinition";
import { CloseWithoutSavingModal } from "./CloseWithoutSavingModal";

const StyledModal = styled(Modal)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
}));

const ModalContent = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.background.paper,
    borderRadius: theme.shape.borderRadius,
    boxShadow: theme.shadows[5],
    padding: theme.spacing(4),
    width: '80%',
    maxWidth: 1200,
    maxHeight: '90vh',
    overflow: 'auto',
}));

const StyledTextField = styled(TextField)(({ theme }) => ({
    marginBottom: theme.spacing(2),
}));

const ActionButton = styled(Button)(({ theme }) => ({
    marginRight: theme.spacing(1),
}));

const EditorBox = styled(Box)(({ theme }) => ({
    border: `1px solid ${theme.palette.divider}`,
    borderRadius: theme.shape.borderRadius,
    padding: theme.spacing(2),
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
}));

type Props = {
    setOpen: (value: boolean) => void;
    open: boolean;
    buttonContent: string;
};

const helloWorldTask = `name: hello world
steps:
  - name: s1
    command: echo hello world
  - name: s2
    command: echo done!
    depends:
      - s1
`;

export const CreateNewTemplateModalButton = ({ open, setOpen, buttonContent }: Props) => {
    const [editing, setEditing] = useState(false);
    const [taskName, setTaskName] = useState('');
    const [taskDescription, setTaskDescription] = useState('');
    const [newTaskDefinition, setNewTaskDefinition] = useState(helloWorldTask);
    const [openConfirmClose, setOpenConfirmClose] = useState(false);
    const [isConfirmCloseWithoutSave, setIsConfirmCloseWithoutSave] = useState(false);
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState('');
    const [snackbarSeverity, setSnackbarSeverity] = useState<'success' | 'error'>('success');

    const handleOpen = () => setOpen(true);
    const handleClose = () => {
        cleanUp();
        setOpen(false);
    };

    const cleanUp = () => {
        setTaskName('');
        setTaskDescription('');
        setNewTaskDefinition(helloWorldTask);
        setIsConfirmCloseWithoutSave(false);
        setEditing(false);
    };

    const addNewTaskTemplate = async () => {
        const taskData = {
            name: taskName,
            code_block: newTaskDefinition,
            description: taskDescription,
        };

        try {

            const baseUrlWorkflowManager = process.env.API_WORKFLOW_MANAGER_BASE_URL || 'localhost';
            const response = await fetch(`http://${baseUrlWorkflowManager}/api/v1/tasks/`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(taskData)
            });

            if (!response.ok) {
                const jsResponse = await response.json();
                throw new Error(`An error has occurred: ${response.status}\n Message: ${jsResponse.detail} `);
            }

            await response.json();
            setSnackbarMessage('Task template added successfully!');
            setSnackbarSeverity('success');
        } catch (error) {
            setSnackbarMessage(error.message);
            setSnackbarSeverity('error');
        } finally {
            setOpenSnackbar(true);
        }
    };

    const importTemplate = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (e) => {
            const text = e.target?.result as string;
            setNewTaskDefinition(text);
        };
        reader.readAsText(file);
    };

    useEffect(() => {
        if (isConfirmCloseWithoutSave) {
            setOpen(false);
        }
        return cleanUp;
    }, [isConfirmCloseWithoutSave, setOpen]);

    const handleCloseSnackbar = () => {
        setOpenSnackbar(false);
    };

    return (
      <>
          <Button variant="outlined" onClick={handleOpen}>{buttonContent}</Button>
          <StyledModal open={open} onClose={() => setOpenConfirmClose(true)}>
              <ModalContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                      Create New Task Template
                  </Typography>
                  <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                          <StyledTextField
                            label="Task Name"
                            variant="outlined"
                            fullWidth
                            value={taskName}
                            onChange={(e) => setTaskName(e.target.value)}
                          />
                          <StyledTextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            minRows={10}
                            value={taskDescription}
                            onChange={(e) => setTaskDescription(e.target.value)}
                          />
                          <Box sx={{ mt: 2, display: 'flex', justifyContent: 'space-between' }}>
                              <ActionButton variant="outlined" onClick={() => setOpenConfirmClose(true)}>
                                  Close
                              </ActionButton>
                              <ActionButton variant="contained" onClick={async () => {
                                  await addNewTaskTemplate();
                                  handleClose();
                              }}>
                                  Save
                              </ActionButton>
                          </Box>
                      </Grid>
                      <Grid item xs={12} md={6}>
                          <EditorBox>
                              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                                  <Typography variant="subtitle1">DAG Definition</Typography>
                                  <Box>
                                      <input
                                        accept=".yaml,.yml"
                                        id="import-file"
                                        type="file"
                                        style={{ display: 'none' }}
                                        onChange={importTemplate}
                                      />
                                      <label htmlFor="import-file">
                                          <Tooltip title="Import YAML">
                                              <IconButton component="span">
                                                  <FontAwesomeIcon icon={faFileUpload} />
                                              </IconButton>
                                          </Tooltip>
                                      </label>
                                      <Tooltip title={editing ? "Save" : "Edit"}>
                                          <IconButton onClick={() => setEditing(!editing)}>
                                              <FontAwesomeIcon icon={editing ? faFloppyDisk : faPenToSquare} />
                                          </IconButton>
                                      </Tooltip>
                                      {editing && (
                                        <Tooltip title="Cancel">
                                            <IconButton onClick={() => setEditing(false)}>
                                                <FontAwesomeIcon icon={faXmark} />
                                            </IconButton>
                                        </Tooltip>
                                      )}
                                  </Box>
                              </Box>
                              <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
                                  {editing ? (
                                    <DAGEditor
                                      value={newTaskDefinition}
                                      onChange={(newValue) => setNewTaskDefinition(newValue)}
                                    />
                                  ) : (
                                    <DAGDefinition value={newTaskDefinition} lineNumbers />
                                  )}
                              </Box>
                          </EditorBox>
                      </Grid>
                  </Grid>
              </ModalContent>
          </StyledModal>
          <CloseWithoutSavingModal
            setIsConfirmCloseWithoutSave={setIsConfirmCloseWithoutSave}
            setOpen={setOpenConfirmClose}
            open={openConfirmClose}
          />
          <Snackbar
            open={openSnackbar}
            autoHideDuration={6000}
            onClose={handleCloseSnackbar}
          >
              <Alert onClose={handleCloseSnackbar} severity={snackbarSeverity} sx={{ width: '100%' }}>
                  {snackbarMessage}
              </Alert>
          </Snackbar>
      </>
    );
};
