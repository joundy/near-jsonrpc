import { mkdirSync, rmSync, writeFileSync } from "fs";
import { Project } from "ts-morph";
import { SCHEMA_DIR, SCHEMA_FILE, TEMP_DIR, ZOD_SCHEMA_DIR, ZOD_SCHEMA_FILE } from "./constants";

// Validate a single schema, usefull for debugging
export function validate(schema: string, zodSchema: string): string[] {
  const project = new Project({
    compilerOptions: {
      strict: true,
    },
  });

  const source = `
    import { z } from "zod/v4";
    import { expectTypeOf } from "expect-type";
    import { ${schema} } from "${SCHEMA_DIR}";
    
    import { ${zodSchema} } from "${ZOD_SCHEMA_DIR}";
    
    expectTypeOf<
      z.infer<typeof ${zodSchema}>
    >().toEqualTypeOf<${schema}>();
      `;

  const sourceFile = project.createSourceFile(
    `${TEMP_DIR}/integration-${schema}.ts`,
    source
  );

  const errors: string[] = [];

  const diagnostics = sourceFile.getPreEmitDiagnostics();
  diagnostics.forEach((diagnostic) => {
    const message = diagnostic.getMessageText();
    const messageText =
      typeof message === "string" ? message : message.getMessageText();

    errors.push(messageText);
  });

  project.removeSourceFile(sourceFile);

  return errors;
}

// Validate all schemas, it's fast but not as detailed as validate one by one
export function validateAll(schemas: { schema: string; zodSchema: string }[]) {
  const project = new Project({
    compilerOptions: {
      strict: true,
    },
  });

  const source = `
  import { z } from "zod/v4";
  import { expectTypeOf } from "expect-type";
  import { ${schemas
    .map((schema) => schema.schema)
    .join(", ")} } from "${SCHEMA_DIR}";
  
  import { ${schemas
    .map((schema) => schema.zodSchema)
    .join(", ")} } from "${ZOD_SCHEMA_DIR}";
  

  ${schemas
    .map(
      ({ schema, zodSchema }) => `
    expectTypeOf<
      z.infer<typeof ${zodSchema}>
    >().toEqualTypeOf<${schema}>();
  `
    )
    .join("\n")}
    `;

  const sourceFile = project.createSourceFile(
    `${TEMP_DIR}/integration-all-schemas.ts`,
    source
  );

  const errors: string[] = [];

  const diagnostics = sourceFile.getPreEmitDiagnostics();
  diagnostics.forEach((diagnostic) => {
    const message = diagnostic.getMessageText();
    const messageText =
      typeof message === "string" ? message : message.getMessageText();

    errors.push(messageText);
  });

  project.removeSourceFile(sourceFile);

  return errors;
}

export type ValidateZodSchemaOptions = {
  schemas: string[];
  schemaTs: string;
  zodSchemaTs: string;
  zodSchemaSuffix: string;
  validateAll: boolean;
};

export async function validateZodSchema(options: ValidateZodSchemaOptions) {
  try {
    mkdirSync(TEMP_DIR, { recursive: true });
    writeFileSync(`${TEMP_DIR}/${SCHEMA_FILE}`, options.schemaTs);
    writeFileSync(`${TEMP_DIR}/${ZOD_SCHEMA_FILE}`, options.zodSchemaTs);

    console.info(
      `🔍 Starting Zod schema validation for ${options.schemas.length} schemas`
    );

    if (options.validateAll) {
      console.info(`📋 Validating all schemas`);
      const errors = validateAll(
        options.schemas.map((schema) => ({
          schema,
          zodSchema: schema + options.zodSchemaSuffix,
        }))
      );
      if (errors.length > 0) {
        console.error(
          `❌ Validation failed for ${options.schemas.length} schemas:`,
          errors
        );
        throw new Error(
          `Validation failed for ${
            options.schemas.length
          } schemas: ${errors.join(", ")}`
        );
      }
    } else {
      for (const schema of options.schemas) {
        console.info(`📋 Validating schema: ${schema}`);
        const errors = validate(schema, schema + options.zodSchemaSuffix);
        if (errors.length > 0) {
          console.error(`❌ Validation failed for ${schema}:`, errors);
          throw new Error(`Validation failed for ${schema}:`);
        }
        console.info(`✅ Schema ${schema} validated successfully`);
      }
    }

    console.info(
      `🎉 All ${options.schemas.length} schemas validated successfully`
    );
  } finally {
    console.info(`🧹 Cleaning up temporary files`);
    rmSync(TEMP_DIR, { recursive: true });
  }
}
