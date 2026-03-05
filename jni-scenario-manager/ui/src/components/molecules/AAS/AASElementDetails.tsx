import React, { useEffect, useState } from 'react';
import { SubmodelElementResponse } from './types/ElementDetailsTypes';
import { AASElementDetailsCard } from './AASElementDetailsCard';
import { ParamObject, Submodel } from './types/AASTypes';

type Props = {
  selectedElementId: string;
  subModels: Submodel[];
  simulationParamsObjects: ParamObject[];
  aasName: string;
  workflowName: string;
  workflowExecutionDate: string;
}

export const ElementDetails = ({ simulationParamsObjects, subModels, selectedElementId, aasName, workflowName, workflowExecutionDate }: Props) => {
  const [elementDetails, setElementDetails] = useState<SubmodelElementResponse | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [submodelBase64Identifier, setSubmodelBase64Identifier] = useState<string | undefined>(undefined);
  const [testBase64Identifier, setTestBase64Identifier] = useState<string | undefined>("tete");
  const [trimmedSelectedElementId, setTrimmedSelectedElementId] = useState(undefined);


  useEffect(() => {


    const rootObject: RootObject | null = findRootObject(subModels, selectedElementId);


    if (rootObject && selectedElementId.startsWith(rootObject.id)) {

      const selectedElementLabel = selectedElementId.substring(rootObject.id.length + 1);

      setTrimmedSelectedElementId(selectedElementLabel);

    }


    // Convert submodelIdentifier to base64
    if (rootObject) {
      const convertedIdentifiertoBase64 = btoa(rootObject.id);
      if (convertedIdentifiertoBase64) {
        setSubmodelBase64Identifier(convertedIdentifiertoBase64);
      }
      // const element = findLeafObject(rootObject,selectedElementId)
    } else {
      const fetchRootElementDetails = async (submodelIdentifier) => {
        console.log('BB', submodelIdentifier);
        try {

          const baseUrlSubmodelApi = process.env.API_SUBMODEL_BASE_URL || 'localhost';
          const response = await fetch(`http://${baseUrlSubmodelApi}/submodels/${submodelIdentifier}`);
          if (!response.ok) {
            throw new Error('Failed to fetch root element details BB');
          }
          const data: SubmodelElementResponse = await response.json();
          setElementDetails(data);
          console.log('Element Details', data);
        } catch (err) {
          setError(err.message);
        } finally {
          setLoading(false);
        }
      };
      if (selectedElementId) {
        console.log('BB clear', selectedElementId);
        const convertedRootIdentifiertoBase64 = btoa(selectedElementId);
        fetchRootElementDetails(convertedRootIdentifiertoBase64);
      }
    }

    return () => {
      setElementDetails(null);
      setLoading(true);
      setError(null);
      setSubmodelBase64Identifier(undefined);
      setTrimmedSelectedElementId(undefined);
    };


  }, [subModels, selectedElementId,submodelBase64Identifier]);

  useEffect(() => {
    const fetchElementDetails = async (submodelIdentifier, idShortPath) => {

      try {
        console.log("ID PATH", idShortPath);
        const baseUrlSubmodelApi = process.env.API_SUBMODEL_BASE_URL || 'localhost';
        const response = await fetch(`http://${baseUrlSubmodelApi}/submodels/${submodelIdentifier}/submodel-elements/${idShortPath}`);
        if (!response.ok) {
          throw new Error('Failed to fetch element details');
        }
        const data: SubmodelElementResponse = await response.json();
        setElementDetails(data);
        console.log('Element Details', data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    if (submodelBase64Identifier && trimmedSelectedElementId) {
      fetchElementDetails(submodelBase64Identifier, trimmedSelectedElementId);
    }

    // Cleanup function
    return () => {
      setElementDetails(null);
      setLoading(true);
      setError(null);
      setSubmodelBase64Identifier(undefined);
      setTrimmedSelectedElementId(undefined);
    };

  }, [submodelBase64Identifier, trimmedSelectedElementId]);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div> 

      {elementDetails &&
        <AASElementDetailsCard 
          workflowName={workflowName} 
          workflowExecutionDate={workflowExecutionDate}
          aasName={aasName} 
          aasElement={elementDetails} 
          aasElementSubModelId={submodelBase64Identifier}
          simulationParamsObjects={simulationParamsObjects} 
        />
      }
    </div>
  );
};

type Child = {
  id: string;
  label: string;
  type: string;
  parentId: string;
  children?: Child[];
};

type RootObject = {
  children: Child[];
  label: string;
  id: string;
};

const findRootObject = (data: RootObject[], selectedElementId: string): RootObject | null => {
  const findInChildren = (children: Child[], selectedElementId: string): boolean => {
    for (const child of children) {
      if (child.id === selectedElementId) {
        return true;
      }
      if (child.children && findInChildren(child.children, selectedElementId)) {
        return true;
      }
    }
    return false;
  };

  for (const obj of data) {
    if (findInChildren(obj.children, selectedElementId)) {
      return obj;
    }
  }

  return null;
};
