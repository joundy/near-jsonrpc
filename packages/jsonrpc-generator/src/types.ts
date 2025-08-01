export type ResponseType = {
  type: string;
  fromSchema: string;
};

export type RequestDescriminatedType = {
  property: string;
  value: string;
};

export type RequestType = {
  type: string;
  method: string;
  fromSchema: string;
  discriminatedType?: RequestDescriminatedType;
};

export type ErrorType = {
  type: string;
  fromSchema: string;
};

export type MethodType = {
  request: RequestType;
  response: ResponseType;
  error: ErrorType;
};

export type SchemaType = {
  schema: string;
  type: string;
};

export type ZodSchemaType = {
  schema: string;
  type: string;
  zodType?: string;
};


export type RefDiscriminator = {
  referenceSchema: string;
  properties: string[];
};

export type SchemaDiscriminator = {
  schema: string;
  refDiscriminators: RefDiscriminator[];
  typeLiteral?: string;
};