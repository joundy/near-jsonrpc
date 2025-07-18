import { createClient } from "./client";
import { jsonRpcTransporter, NearRpcEndpoint } from "./transporter";

async function main() {
  const transporter = jsonRpcTransporter({ endpoint: NearRpcEndpoint.Testnet });
  const client = createClient(transporter);

  {
    const status = await client.status({});
    if (status.error) {
      console.error(status.error);
      throw new Error(status.error.message);
    }

    const chainId = status.result.chainId;
    const buildVersion = status.result.version.build;

    console.log({
      chainId,
      buildVersion,
    });
  }
}

main();
