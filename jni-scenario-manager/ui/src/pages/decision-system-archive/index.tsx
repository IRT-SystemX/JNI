import React, { useState, useEffect, useMemo } from 'react';
import { Link } from 'react-router-dom';
import {
  Box,
  Container,
  Typography,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  useTheme,
  useMediaQuery,
  Card,
  CardContent,
  TextField,
  CircularProgress,
} from '@mui/material';
import { styled } from '@mui/material/styles';

const StyledContainer = styled(Container)(({ theme }) => ({
  height: '100%',
  display: 'flex',
  flexDirection: 'column',
  padding: theme.spacing(4),
}));

const StyledPaper = styled(Paper)(({ theme }) => ({
  padding: theme.spacing(4),
  borderRadius: theme.shape.borderRadius,
  boxShadow: 'none',
  border: '1px solid #e0e0e0',
  flexGrow: 1,
  display: 'flex',
  flexDirection: 'column',
  overflow: 'hidden',
}));

const StyledTable = styled(Table)(({ theme }) => ({
  minWidth: 650,
  '& .MuiTableCell-root': {
    borderBottom: 'none',
    padding: theme.spacing(2),
  },
  '& .MuiTableRow-root': {
    '&:nth-of-type(odd)': {
      backgroundColor: '#f9f9f9',
    },
  },
}));

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  fontWeight: 500,
  color: theme.palette.text.primary,
}));

const StyledCard = styled(Card)(({ theme }) => ({
  marginBottom: theme.spacing(2),
  boxShadow: 'none',
  border: '1px solid #e0e0e0',
}));

interface ArchiveItem {
  workflow_execution_id: string;
  workflow_name: string;
  aas_name: string;
  property_name: string;
  workflow_execution_date: string;
  updated_date: string;
  user_id: string;
  id: string;
}

const DecisionSystemArchivePage: React.FC = () => {
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [searchTerm, setSearchTerm] = useState('');
  const [archiveItems, setArchiveItems] = useState<ArchiveItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchArchiveItems = async () => {
      try {
        const baseUrlWorkflowManager = process.env.API_WORKFLOW_MANAGER_BASE_URL || 'localhost';
        const response = await fetch(`http://${baseUrlWorkflowManager}/api/v1/archive-items/`);
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        const data: ArchiveItem[] = await response.json();
        setArchiveItems(data);
        setIsLoading(false);
      } catch (err) {
        setError('Failed to fetch archive items');
        setIsLoading(false);
      }
    };

    fetchArchiveItems();
  }, []);

  const filteredData = useMemo(() => {
    return archiveItems.filter(item =>
      item.property_name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [searchTerm, archiveItems]);

  const sortedData = filteredData.sort((a, b) => {
    return new Date(b.updated_date) - new Date(a.updated_date);
  });

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(event.target.value);
  };

  const appBarHeight = 98;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleString();
  };

  if (isLoading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <Box sx={{
      bgcolor: '#ffffff',
      minHeight: `calc(100vh - ${appBarHeight}px)`,
      width: '100vw',
      overflow: 'hidden',
      display: 'flex',
      flexDirection: 'column',
    }}>
      <StyledContainer maxWidth="xl">
        <Typography variant="h4" sx={{ fontWeight: 300, mb: 1 }}>
          Decision System Archive
        </Typography>
        <Typography variant="subtitle1" sx={{ mb: 4, color: 'text.secondary' }}>
          Track and review historical updates to the decision system
        </Typography>
        <TextField
          label="Search by Property Name"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={handleSearchChange}
          sx={{ mb: 4 }}
        />
        <StyledPaper>
          <Box sx={{ flexGrow: 1, overflow: 'auto' }}>
            {isSmallScreen ? (
              <Box sx={{ height: '100%' }}>
                {sortedData.map((item) => (
                  <StyledCard key={formatDate(item.id)}>
                    <CardContent>
                      <Typography variant="subtitle1" component="div" sx={{ mb: 1 }}>
                        {item.property_name}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">AAS: {item.aas_name}</Typography>
                      <Typography variant="body2" color="text.secondary">Workflow: {item.workflow_name}</Typography>
                      <Typography variant="body2" color="text.secondary">Execution Date: {formatDate(item.workflow_execution_date)}</Typography>
                      <Typography variant="body2" color="text.secondary">Updated Date: {formatDate(item.updated_date)}</Typography>
                      <Typography variant="body2" color="text.secondary">User ID: {item.user_id}</Typography>
                      <Typography variant="body2" color="text.secondary">Workflow Execution Id: {item.workflow_execution_id}</Typography>
                    </CardContent>
                  </StyledCard>
                ))}
              </Box>
            ) : (
              <TableContainer sx={{ height: '100%' }}>
                <StyledTable>
                  <TableHead>
                    <TableRow>
                      <StyledTableCell>AAS Name</StyledTableCell>
                      <StyledTableCell>Property Name</StyledTableCell>
                      <StyledTableCell>Workflow</StyledTableCell>
                      <StyledTableCell>Execution Date</StyledTableCell>
                      <StyledTableCell>Updated Date</StyledTableCell>
                      <StyledTableCell>User ID</StyledTableCell>
                      <StyledTableCell>ID</StyledTableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {sortedData.map((row) => (
                      <TableRow key={row.id}>
                        <TableCell>{row.aas_name}</TableCell>
                        <TableCell>{row.property_name}</TableCell>
                        <TableCell>
                          <Link to={`/dags/${row.workflow_name}/history`}>
                            {row.workflow_name}
                          </Link>
                        </TableCell>
                        <TableCell>{formatDate(row.workflow_execution_date)}</TableCell>
                        <TableCell>{formatDate(row.updated_date)}</TableCell>
                        <TableCell>{row.user_id}</TableCell>
                        <TableCell>{row.workflow_execution_id}</TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </StyledTable>
              </TableContainer>
            )}
          </Box>
        </StyledPaper>
      </StyledContainer>
    </Box>
  );
};

export default DecisionSystemArchivePage;
