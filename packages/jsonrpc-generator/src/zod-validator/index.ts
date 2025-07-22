import { mkdirSync, rmSync, writeFileSync } from "fs";
import { Project } from "ts-morph";

export function validate(schema: string, zodSchema: string): string[] {
  const project = new Project({
    compilerOptions: {
      strict: true,
    },
  });

  const source = `
    import { z } from "zod/v4";
    import { expectTypeOf } from "expect-type";
    import { ${schema} } from "./schemas";
    
    import { ${zodSchema} } from "./zod-schemas";
    
    expectTypeOf<
      z.infer<typeof ${zodSchema}>
    >().toEqualTypeOf<${schema}>();
      `;

  const sourceFile = project.createSourceFile(
    "./_temp_zod_validator/integration-${schema}.ts",
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
};

export async function validateZodSchema(options: ValidateZodSchemaOptions) {
  try {
    mkdirSync("./_temp_zod_validator", { recursive: true });
    writeFileSync("./_temp_zod_validator/schemas.ts", options.schemaTs);
    writeFileSync("./_temp_zod_validator/zod-schemas.ts", options.zodSchemaTs);

    // console.info("Running the validation to validate zod schemas...");
    for (const schema of options.schemas) {
    //   console.info(`Validating: ${schema}`);

      const errors = validate(schema, schema + options.zodSchemaSuffix);
      if (errors.length > 0) {
        console.error(errors);
        throw new Error(`Validation failed for ${schema}:`);
      }
    }
  } finally {
    rmSync("./_temp_zod_validator", { recursive: true });
  }
}
