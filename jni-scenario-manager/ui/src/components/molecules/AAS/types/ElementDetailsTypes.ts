// Element Details
export type Qualifier = {
  type: string;
  value: string;
  valueType: string;
};

export type Key = {
  type: string;
  value: string;
};

export type SemanticId = {
  keys: Key[];
  type: string;
};

export type InputVariable = {
  value: {
    modelType: string;
    value: string | number;
    valueType: string;
    idShort: string;
  };
};

export type SubmodelElementResponse = {
  modelType: string;
  qualifiers: Qualifier[];
  idShort: string;
  semanticId: SemanticId;
  inputVariables: InputVariable[];
};
