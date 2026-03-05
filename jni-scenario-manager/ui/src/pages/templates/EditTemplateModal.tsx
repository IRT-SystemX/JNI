import React, { useEffect, useState } from "react";
import { Box, Button, Grid, TextField, Typography, Modal, IconButton, Tooltip } from "@mui/material";
import { styled } from '@mui/material/styles';
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faPenToSquare } from "@fortawesome/free-solid-svg-icons";
import DAGEditor from "../../components/atoms/DAGEditor";
import DAGDefinition from "../../components/molecules/DAGDefinition";
import { TaskTemplate } from "../../components/organizations/DAGSpec";
import {CloseWithoutSavingModal} from "./CloseWithoutSavingModal";

const StyledModal = styled(Modal)(({ theme }) => ({
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: theme.zIndex.modal,
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
    initialData: TaskTemplate;
};

export const EditTemplateModal = ({ open, setOpen, initialData }: Props) => {
    const [editing, setEditing] = useState(false);
    const [taskName, setTaskName] = useState(initialData.name || '');
    const [taskDescription, setTaskDescription] = useState(initialData.description || '');
    const [newTaskDefinition, setNewTaskDefinition] = useState(initialData.code_block || '');
    const [openConfirmClose, setOpenConfirmClose] = useState(false);
    const [isConfirmCloseWithoutSave, setIsConfirmCloseWithoutSave] = useState(false);

    const handleClose = () => setOpen(false);

    const addNewTaskTemplate = async () => {
        const taskData = {
            code_block: newTaskDefinition,
            description: taskDescription,
        };

        const baseUrlWorkflowManager = process.env.API_WORKFLOW_MANAGER_BASE_URL || 'localhost';
        const response = await fetch(`http://${baseUrlWorkflowManager}/api/v1/tasks/${initialData.id}`, {
            method: 'PATCH',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(taskData)
        });

        if (!response.ok) {
            throw new Error(`An error has occurred: ${response.status}`);
        }

        return await response.json();
    };

    useEffect(() => {
        if (isConfirmCloseWithoutSave) {
            setOpen(false);
        }

        return () => {
            setIsConfirmCloseWithoutSave(false);
            setEditing(false);
            setTaskName(initialData.name);
            setTaskDescription(initialData.description);
            setNewTaskDefinition(initialData.code_block);
        };
    }, [isConfirmCloseWithoutSave, initialData, setOpen]);

    return (
      <>
          <StyledModal open={open} onClose={() => setOpenConfirmClose(true)}>
              <ModalContent>
                  <Typography variant="h6" component="h2" gutterBottom>
                      Edit "{taskName}" Template
                  </Typography>
                  <Grid container spacing={3}>
                      <Grid item xs={12} md={6}>
                          <StyledTextField
                            label="Task Name"
                            variant="outlined"
                            fullWidth
                            value={taskName}
                            disabled
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
                                  <Tooltip title={editing ? "Preview" : "Edit"}>
                                      <IconButton onClick={() => setEditing(!editing)}>
                                          <FontAwesomeIcon icon={editing ? faEye : faPenToSquare} />
                                      </IconButton>
                                  </Tooltip>
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
      </>
    );
};
