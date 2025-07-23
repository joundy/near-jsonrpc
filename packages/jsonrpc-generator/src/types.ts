export type ResponseType = {
  type: string;
  fromSchema: string;
};

export type RequestType = {
  type: string;
  method: string;
  fromSchema: string;
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
