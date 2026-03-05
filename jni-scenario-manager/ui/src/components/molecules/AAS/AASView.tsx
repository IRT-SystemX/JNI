import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography, Snackbar, Alert, Skeleton } from '@mui/material';
import { ElementDetails } from './AASElementDetails';
import { AASTree } from './AASTree';
import { SubmodelElementResponse } from './types/ElementDetailsTypes';
import { ParamObject, Submodel } from './types/AASTypes';

// AAS Descriptors
interface ProtocolInformation {
  href: string;
  endpointProtocolVersion: string[];
}

interface Endpoint {
  interface: string;
  protocolInformation: ProtocolInformation;
}

interface ShellDescriptor {
  endpoints: Endpoint[];
  idShort: string;
  id: string;
}

interface ShellDescriptorData {
  paging_metadata: Record<string, unknown>;
  result: Array<ShellDescriptor>;
}

// Submodel Refs
interface SubmodelReferenceKey {
  type: string;
  value: string;
}

interface SubmodelReference {
  keys: SubmodelReferenceKey[];
  type: string;
}

interface SubmodelRefsResponse {
  paging_metadata: Record<string, unknown>;
  result: SubmodelReference[];
}

type Props = {
  simulationParams: string
  status: any
}

export const AASView = React.memo(({ simulationParams, status }: Props) => {
  console.log('xo simulationParams', simulationParams);
  console.log('xo status', status);

  const simulationParamsObjects: ParamObject[] = parseParamsStringToObjects(simulationParams);

  const [shellDescriptors, setShellDescriptors] = useState<Array<ShellDescriptor>>([]);
  const [selectedAASDescriptor, setSelectedAASDescriptor] = useState<ShellDescriptor | undefined>(undefined);
  const [selectedAASId, setSelectedAASId] = useState<string>('');
  const [subModels, setSubModels] = useState<Submodel[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [selectedElementId, setSelectedElementId] = useState<string | undefined>(undefined);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

  useEffect(() => {
    const fetchShellDescriptors = async () => {
      setLoading(true);
      setErrorMessage(null);
      try {
        const baseUrl = process.env.API_SHELL_BASE_URL || 'localhost';
        const response: Response = await fetch(`http://${baseUrl}/shell-descriptors`);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data: ShellDescriptorData = await response.json();
        setShellDescriptors(data.result);
      } catch (error) {
        if (error instanceof Error) {
          setErrorMessage(error.message);
          setSnackbarMessage(`Error fetching shell descriptors: ${error.message}`);
          setSnackbarOpen(true);
        }
        console.error('Fetching error: ', error);
      }
      setLoading(false);
    };

    fetchShellDescriptors();
  }, []);

  async function fetchSubmodelElements(submodelId: string) {
    const base64SubmodelId = btoa(submodelId);
    const baseUrlSubmodelApi = process.env.API_SUBMODEL_BASE_URL || 'localhost';
    const url = `http://${baseUrlSubmodelApi}/submodels/${encodeURIComponent(base64SubmodelId)}/submodel-elements`;
    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
      return data.result;
    } catch (error) {
      console.error('Fetching submodel elements error: ', error);
      if (error instanceof Error) {
        setSnackbarMessage(`Error fetching submodel elements: ${error.message}`);
        setSnackbarOpen(true);
      }
      throw error;
    }
  }

  async function fetchSubmodelsByBase64AASId(base64AASId: string) {
    setLoading(true);
    setErrorMessage(null);
    try {

      const baseUrlSubmodelApi = process.env.API_SUBMODEL_BASE_URL || 'localhost';
      const response: Response = await fetch(`http://${baseUrlSubmodelApi}/shells/${base64AASId}/submodel-refs`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data: SubmodelRefsResponse = await response.json();
      const submodelElements = await Promise.all(data.result.map(async item => {
        const submodelElements = await fetchSubmodelElements(item.keys[0].value);
        const parentId: string = item.keys[0].value;

        let parsedLabel: string;

        if (isValidURL(parentId)) {
          const segments: string[] = parentId.split('/');
          parsedLabel = segments.pop() || segments.pop() || '';
        } else {
          parsedLabel = parentId;
        }


        const convertedRootIdentifiertoBase64 = btoa(item.keys[0].value);

        let subModelData: SubmodelElementResponse | undefined = undefined;

        try {
          const response = await fetch(`http://${baseUrlSubmodelApi}/submodels/${convertedRootIdentifiertoBase64}`);
          if (!response.ok) {
            throw new Error('Failed to fetch root element details');
          }
          subModelData = await response.json();
          console.log('subModelData', subModelData);
        } catch (err) {
          setErrorMessage(err.message);
          setSnackbarMessage(`Error fetching root element details: ${err.message}`);
          setSnackbarOpen(true);
        }

        return {
          children: [...buildTreeItems(submodelElements, parentId)],
          label: subModelData?.idShort ?? parsedLabel,
          ...subModelData,
        };
      }));
      setSubModels(submodelElements);
    } catch (error) {
      if (error instanceof Error) {
        setErrorMessage(error.message);
        setSnackbarMessage(`Error fetching submodels: ${error.message}`);
        setSnackbarOpen(true);
      }
      console.error('Fetching error: ', error);
    }
    setLoading(false);
  }

  const handleSelectedElementId = (id: string) => {
    setSelectedElementId(id);
  };

  const handleSelectAAS = async (descriptor: ShellDescriptor) => {
    const aasId = descriptor.id;
    setSelectedElementId(undefined);
    setSelectedAASDescriptor(descriptor);
    setSelectedAASId(aasId);
    const base64AASId = btoa(aasId);
    await fetchSubmodelsByBase64AASId(base64AASId);
  };

  const handleSnackbarClose = (event?: React.SyntheticEvent | Event, reason?: string) => {
    if (reason === 'clickaway') {
      return;
    }
    setSnackbarOpen(false);
  };


  const appBarHeight = 84;

  return (
    <Box sx={{ height: `calc(100vh - ${appBarHeight}px)`, overflow: 'hidden', bgcolor: '#f8fafc' }}>
      <Grid container sx={{ height: '100%' }}>
        {[
          { title: 'AAS', content: shellDescriptors },
          { title: 'AAS Treeview', content: subModels },
          { title: 'Element Details', content: selectedElementId && subModels.length > 0 },
        ].map((column, index) => (
          <Grid item xs={12} md={4} key={index}
                sx={{ height: '100%', borderRight: index < 2 ? '1px solid #e2e8f0' : 'none' }}>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'column',
                height: '100%',
                overflow: 'hidden',
              }}
            >
              <Box sx={{ p: 2, borderBottom: '1px solid #e2e8f0', bgcolor: 'white' }}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: 600,
                    color: '#2d3748',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}
                >
                  {index === 1 && selectedAASDescriptor
                    ? `${column.title} for ${selectedAASDescriptor.idShort}`
                    : column.title}
                </Typography>
              </Box>
              <Box
                sx={{
                  flexGrow: 1,
                  overflowY: 'auto',
                  overflowX: 'hidden',
                  p: 2,
                  '&::-webkit-scrollbar': {
                    width: '6px',
                    height: '6px',
                  },
                  '&::-webkit-scrollbar-thumb': {
                    backgroundColor: '#cbd5e0',
                    borderRadius: '3px',
                  },
                  '&::-webkit-scrollbar-track': {
                    backgroundColor: '#f1f5f9',
                  },
                }}
              >
                {index === 0 && (
                  loading && !selectedAASId ? (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {[...Array(3)].map((_, i) => (
                        <Skeleton key={i} variant="rectangular" height={100} />
                      ))}
                    </Box>
                  ) : (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      {column.content.map(descriptor => (
                        <Card
                          key={descriptor.id}
                          sx={{
                            flexGrow: 1,
                            cursor: 'pointer',
                            minWidth: '200px',
                            borderRadius: 1,
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            transition: 'all 0.2s ease',
                            '&:hover': {
                              transform: 'translateY(-2px)',
                              boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
                            },
                          }}
                          onClick={() => handleSelectAAS(descriptor)}
                        >
                          <CardContent>
                            <Typography variant="subtitle1" sx={{ fontWeight: 500, mb: 0.5 }}>
                              {descriptor.idShort}
                            </Typography>
                            <Typography variant="body2" color="text.secondary" sx={{ fontSize: '0.75rem' }}>
                              ID: {descriptor.id}
                            </Typography>
                          </CardContent>
                        </Card>
                      ))}
                    </Box>
                  )
                )}
                {index === 1 && (
                  loading ? (
                    <Skeleton variant="rectangular" height="100%" />
                  ) : (
                    column.content &&
                    <AASTree subModels={column.content} handleSelectedElementId={handleSelectedElementId}
                             simulationParamsObjects={simulationParamsObjects} />
                  )
                )}
                {index === 2 && (
                  loading ? (
                    <Skeleton variant="rectangular" height="100%" />
                  ) : (
                    column.content &&
                    <ElementDetails 
                      simulationParamsObjects={simulationParamsObjects} 
                      subModels={subModels}
                      selectedElementId={selectedElementId} 
                      aasName={selectedAASDescriptor.idShort} 
                      workflowName={status.Name}
                      workflowExecutionDate={status.FinishedAt}
                    />
                  )
                ) }
              </Box>
            </Box>
          </Grid>
        ))}
      </Grid>
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity="error" sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
});

type SubmodelElement = {
  idShort: string;
  modelType: string;
  value?: SubmodelElement[];
}

type TreeItem = {
  id: string;
  label: string;
  type: string;
  parentId?: string;
  idShort?: string;
  children?: TreeItem[];
}

function buildTreeItems(elements: SubmodelElement[], parentId: string): TreeItem[] {
  return elements.map((element: SubmodelElement) => {
    const id = `${parentId}.${element.idShort}`;
    const label = element.idShort;
    const type = element.modelType;

    const children = element.value && Array.isArray(element.value)
      ? buildTreeItems(element.value, id)
      : undefined;

    return { id, label, type, children, parentId, idShort: element.idShort };
  });
}

function isValidURL(string: string): boolean {
  try {
    new URL(string);
    return true;
  } catch (_) {
    return false;
  }
}

function parseParamsStringToObjects(inputString: string): ParamObject[] {
  const regex = /(\w+)="([^"]*)"/g;
  const result: ParamObject[] = [];
  const matches = inputString.matchAll(regex);

  for (const match of matches) {
    const obj: ParamObject = {
      paramName: match[1],
      value: match[2],
    };

    result.push(obj);
  }

  return result;
}
