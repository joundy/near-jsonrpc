import type { RpcQueryResponse } from "@near-js/jsonrpc-types/schemas";
import { createClient } from "./client";
import { jsonRpcTransporter, NearRpcEndpoint } from "./transporter";

async function main() {
  const transporter = jsonRpcTransporter({ endpoint: NearRpcEndpoint.Testnet });
  const client = createClient(transporter);

  {
    const req = await client.status({});
    if (req.error) {
      console.error(req.error);
      throw new Error(req.error.message);
    }

    const chainId = req.result.chainId;
    const buildVersion = req.result.version.build;

    console.log({
      chainId,
      buildVersion,
    });

    {
      const req = await client.query({
        requestType: "view_access_key",
        accountId: "kangmalu.testnet",
        publicKey: "",
        finality: "final",
      });

      if (req.error) {
        console.error(req.error);
        throw new Error(req.error.message);
      }
      req.result.blockHash

    }

    {
      const req = await client.block({
        blockId: "",
      });

      if (req.error) {
        console.error(req.error);
        throw new Error(req.error.message);
      }
    }
  }
}

main();
