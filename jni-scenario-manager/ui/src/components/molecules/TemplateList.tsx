import React, { useState } from 'react';
import { Box, Card, CardContent, Typography, IconButton, Tooltip, Grid } from '@mui/material';
import { styled } from '@mui/material/styles';
import ContentPasteIcon from '@mui/icons-material/ContentPaste';
import FileDownloadIcon from '@mui/icons-material/FileDownload';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import DAGDefinition from './DAGDefinition';
import { WorkflowTemplate } from '../../pages/templates';
import CreateDAGButton from './CreateDAGButton';
import { TaskTemplate } from '../organizations/DAGSpec';
import DeleteTemplateModal from '../../pages/templates/DeleteTemplateModal';
import { EditTemplateModal } from '../../pages/templates/EditTemplateModal';
import { saveAs } from 'file-saver';

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(3),
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  border: `1px solid ${theme.palette.divider}`,
  transition: 'box-shadow 0.3s ease-in-out',
  '&:hover': {
    boxShadow: theme.shadows[4],
  },
}));


const StyledCardContent = styled(CardContent)(({ theme }) => ({
  padding: theme.spacing(3),
}));

const ActionButton = styled(IconButton)(({ theme }) => ({
  marginLeft: theme.spacing(1),
}));

type Props = {
  workflowTemplateList: WorkflowTemplate[]
  setOpenModal: (value: boolean) => void
  openModal: boolean
  setOpenDeleteModal: (value: boolean) => void
  openDeleteModal: boolean
};

export const TemplateList = ({
                               workflowTemplateList,
                               setOpenModal,
                               openModal,
                               setOpenDeleteModal,
                               openDeleteModal,
                             }: Props) => {
  const [templateToEdit, setTemplateToEdit] = useState<TaskTemplate | undefined>(undefined);

  const exportTemplate = (templateName: string) => {
    const template = workflowTemplateList.find((template: TaskTemplate) => template.name === templateName);
    if (template) {
      const blob = new Blob([template.code_block], { type: 'text/plain;charset=utf-8' });
      saveAs(blob, `${template.name}-template.yaml`);
    }
  };

  return (
    <Box>
      {templateToEdit && (
        <EditTemplateModal
          key={templateToEdit.name}
          initialData={templateToEdit}
          open={openModal}
          setOpen={setOpenModal}
        />
      )}
      {templateToEdit?.id && (
        <DeleteTemplateModal
          key={templateToEdit.name}
          idToDelete={templateToEdit.id}
          open={openDeleteModal}
          setOpen={setOpenDeleteModal}
        />
      )}

        {workflowTemplateList.length === 0 ? (
          <Typography variant="body1" color="text.secondary" align="center">
            No templates available. Create a new template to get started.
          </Typography>
        ) : (
          workflowTemplateList.map((template, idx) => (
            <StyledCard key={`${template.name}-${idx}`}>
              <StyledCardContent>
                <Grid container spacing={2} alignItems="center">
                  <Grid item xs={12} lg={6}>
                    <Typography variant="h6" component="h3" gutterBottom>
                      {template.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" paragraph>
                      {template.description}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} lg={6} container justifyContent="flex-end" spacing={1}>
                    <Grid item>
                      <Tooltip title="Export Template">
                        <ActionButton
                          onClick={() => exportTemplate(template.name)}
                          size="small"
                          aria-label="Export Template"
                        >
                          <FileDownloadIcon />
                        </ActionButton>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title="Copy Code">
                        <ActionButton
                          onClick={() => navigator.clipboard.writeText(template.code_block)}
                          size="small"
                          aria-label="Copy Code"
                        >
                          <ContentPasteIcon />
                        </ActionButton>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title="Edit Template">
                        <ActionButton
                          onClick={() => {
                            setTemplateToEdit(template);
                            setOpenModal(true);
                          }}
                          size="small"
                          aria-label="Edit Template"
                        >
                          <EditIcon />
                        </ActionButton>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <Tooltip title="Delete Template">
                        <ActionButton
                          onClick={() => {
                            setTemplateToEdit(template);
                            setOpenDeleteModal(true);
                          }}
                          size="small"
                          color="error"
                          aria-label="Delete Template"
                        >
                          <DeleteIcon />
                        </ActionButton>
                      </Tooltip>
                    </Grid>
                    <Grid item>
                      <CreateDAGButton codeTemplate={template.code_block} />
                    </Grid>
                  </Grid>
                </Grid>
                {template.code_block && (
                  <Box mt={2}>
                    <DAGDefinition
                      value={template.code_block}
                      lineNumbers
                    />
                  </Box>
                )}
              </StyledCardContent>
            </StyledCard>
          ))
        )}
    </Box>
  );
};
