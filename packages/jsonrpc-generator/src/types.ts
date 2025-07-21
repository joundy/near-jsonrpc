export type ResponseType = {
  schema: string;
  isArray: boolean;
  isNullable: boolean;
};

export type RequestType = {
  schema: string;
  method: string;
};

export type ErrorType = {
  schema: string;
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
