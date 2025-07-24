import {
  RpcClient,
  createClient,
  jsonRpcTransporter,
  NearRpcEndpoint,
} from "../../src/index";

describe("NEAR JSON-RPC Client Integration", () => {
  let client: RpcClient;

  beforeAll(() => {
    const transporter = jsonRpcTransporter({
      endpoint: NearRpcEndpoint.Testnet,
    });
    client = createClient(transporter);
  });

  it("should get network status", async () => {
    const result = await client.status(null);

    expect(result.error).toBeUndefined();
    expect(result.result).toBeDefined();
    expect(result.result?.chainId).toBe("testnet");
    expect(typeof result.result?.protocolVersion).toBe("number");
  }, 10000);

  it("should query account information", async () => {
    const result = await client.query({
      requestType: "view_account",
      finality: "final",
      accountId: "test.near",
    });

    expect(result.error).toBeUndefined();
    expect(result.result).toBeDefined();
    // @ts-expect-error - TODO: fix this
    expect(typeof result.result?.amount).toBe("string");
  }, 10000);

  it("should get latest block", async () => {
    const result = await client.block({
      finality: "final",
    });

    expect(result.error).toBeUndefined();
    expect(result.result).toBeDefined();
    expect(result.result?.header).toBeDefined();
    expect(typeof result.result?.header.height).toBe("number");
    expect(typeof result.result?.header.hash).toBe("string");
  }, 10000);

  it("should handle validation errors", async () => {
    const clientWithValidation = createClient(
      jsonRpcTransporter({ endpoint: NearRpcEndpoint.Testnet }),
      true
    );

    // TODO: add test for runtime validation
    // This should pass validation
    // const validResult = await clientWithValidation.gasPrice({});
    // expect(validResult.error).toBeUndefined();
    // expect(validResult.result).toBeDefined();
  }, 10000);
});
