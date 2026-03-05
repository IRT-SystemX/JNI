export type SubmodelElement = {
  id: string;
  label: string;
  type: string;
  parentId: string;
  idShort: string;
  children?: SubmodelElement[];
}

export type Submodel = {
  id: string;
  label: string;
  children: SubmodelElement[];
}

export type ParamObject = {
  paramName: string;
  value: string;
}
