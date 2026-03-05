import React from 'react';
import { Status } from '../../models';
import StatusChip from '../atoms/StatusChip';
import { Button, IconButton, Stack, Tooltip } from '@mui/material';
import LabeledItem from '../atoms/LabeledItem';
import { Link } from 'react-router-dom';
import { DecisionSystemModal } from './AAS/DecisionSystemModal';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LinkIcon from '@mui/icons-material/Link';
import JNI_LOGO from '../../assets/images/K0604_Logo_JNI_RVB_800px.png';

type Props = {
  status?: Status;
  name: string;
  file?: string;
};

function DAGStatusOverview({ status, name, file = '' }: Props) {

  const [open, setOpen] = React.useState(false);

  const handleClickOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const url = `/dags/${name}/scheduler-log?&file=${encodeURI(file)}`;
  if (!status) {
    return null;
  }
  return (
    <>
      <DecisionSystemModal status={status} handleClickOpen={handleClickOpen} open={open} handleClose={handleClose} />
      <Stack direction="column" spacing={1}>
        <LabeledItem label="Status">
          <StatusChip status={status.Status}>{status.StatusText}</StatusChip>
        </LabeledItem>
        <LabeledItem label="Request ID">{status.RequestId}</LabeledItem>
        <Stack direction="row" sx={{ alignItems: 'center' }} spacing={2}>
          <LabeledItem label="Started At">{status.StartedAt}</LabeledItem>
          <LabeledItem label="Finished At">{status.FinishedAt}</LabeledItem>
        </Stack>
        <LabeledItem label="Params">{status.Params}</LabeledItem>

        <LabeledItem label="Scheduler Log">
          <Link to={url}>{status.Log}</Link>
        </LabeledItem>
        <Box sx={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          bgcolor: 'background.paper',
          borderRadius: 2,
          p: 2,
          boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
          transition: 'all 0.3s ease',
          '&:hover': {
            boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
          }
          , cursor: 'pointer',
        }}
             onClick={handleClickOpen}
        >
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Box
              component="img"
              src={JNI_LOGO}
              alt="JNI Logo"
              sx={{
                width: 40,
                height: 40,
                marginRight: 2,
                objectFit: 'contain',
              }}
            />
            <Box>

              <Typography variant="subtitle2" color="text.secondary" gutterBottom>
                Decision System Params
              </Typography>
              <Typography variant="body2" color="text.primary">
                JNI Connection
              </Typography>
            </Box>
          </Box>
          <Tooltip title="Connect to JNI" arrow>
            <IconButton
              sx={{
                bgcolor: 'primary.main',
                color: 'primary.contrastText',
                '&:hover': {
                  bgcolor: 'primary.dark',
                },
              }}
            >
              <LinkIcon />
            </IconButton>
          </Tooltip>
        </Box>
      </Stack>
    </>
  );
}

export default DAGStatusOverview;


