import { Project, SourceFile } from "ts-morph";
import type { SchemaDiscriminator } from "../types";

/**
 * Extends schema with schema discriminators from the schemas.
 * These will extend the schemas with discriminator helpers.
 */
export function extendSchemaWithDiscriminators(
  schemasTs: string,
  schemaDiscriminators: SchemaDiscriminator[]
) {
  const project = new Project();

  // create a virtual file to export the methods
  const source = project.createSourceFile(
    "__temp__builder_schema_discriminators.ts",
    schemasTs
  );

  // Generate discriminator function for each schema
  schemaDiscriminators.forEach((config) => {
    if (!config.schema || !config.refDiscriminators?.length) {
      console.warn(`Invalid config for schema: ${config.schema}`);
      return;
    }

    createDiscriminatorFunction(source, config);
  });

  source.formatText();

  const text = source.getFullText();
  project.removeSourceFile(source);

  return text;
}

function createDiscriminatorFunction(
  sourceFile: SourceFile,
  config: SchemaDiscriminator
): void {
  const { schema, refDiscriminators, typeLiteral } = config;

  const functionName = `Discriminate${schema}`;

  // Check if function already exists to avoid duplicates
  const existingFunction = sourceFile.getFunction(functionName);
  if (existingFunction) {
    return;
  }


  sourceFile
    .addFunction({
      name: functionName,
      isExported: true,
      parameters: [
        {
          name: "obj",
          type: schema,
        },
      ],
      returnType: (writer) => {
        writer.write("{").newLine();

        refDiscriminators.forEach((ref, index) => {
          writer.write(`  ${ref.referenceSchema}?: `);

          if (typeLiteral) {
            writer.write(typeLiteral.trim());
            writer.newLine();
            writer.write("  & ");
            writer.write(ref.referenceSchema);
          } else {
            writer.write(ref.referenceSchema);
          }

          writer.write(";");
          if (index < refDiscriminators.length - 1) {
            writer.newLine();
          }
        });

        writer.newLine().write("}");
      },
    })
    .setBodyText((writer) => {
      // Declare variables with explicit types
      refDiscriminators.forEach((ref) => {
        writer.writeLine(
          `let ${ref.referenceSchema}: ReturnType<typeof ${functionName}>['${ref.referenceSchema}'] = undefined`
        );
      });

      // Add conditional checks
      refDiscriminators.forEach((ref) => {
        const conditions = ref.properties
          .map((prop) => `"${prop}" in obj`)
          .join(" && ");

        writer.writeLine(`if(${conditions}) {`);
        writer.writeLine(`  ${ref.referenceSchema} = obj;`);
        writer.writeLine("}");
      });

      // Return statement
      writer.writeLine("return {");
      refDiscriminators.forEach((ref, index) => {
        const comma = index < refDiscriminators.length - 1 ? "," : "";
        writer.writeLine(`  ${ref.referenceSchema}${comma}`);
      });
      writer.writeLine("};");
    });
}
