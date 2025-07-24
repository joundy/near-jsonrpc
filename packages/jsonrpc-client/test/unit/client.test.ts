import { createClient } from "../../src/client";
import type { Transporter } from "../../src/types";

describe("createClient", () => {
  let mockTransporter: jest.MockedFunction<Transporter>;

  beforeEach(() => {
    mockTransporter = jest.fn();
  });

  it("creates a client with RPC methods", () => {
    const client = createClient(mockTransporter);

    expect(typeof client.status).toBe("function");
    expect(typeof client.query).toBe("function");
    expect(typeof client.block).toBe("function");
  });

  it("makes successful RPC calls", async () => {
    const mockResponse = {
      result: { chainId: "testnet", protocolVersion: 123 },
      error: null,
    };

    mockTransporter.mockResolvedValueOnce(mockResponse);

    const client = createClient(mockTransporter);
    const result = await client.status(null);

    expect(mockTransporter).toHaveBeenCalledWith("status", expect.any(Object));
    expect(result.result).toHaveProperty("chainId", "testnet");
  });

  it("handles RPC errors", async () => {
    const mockResponse = {
      result: null,
      error: { code: -32602, message: "Invalid params" },
    };

    mockTransporter.mockResolvedValueOnce(mockResponse);

    const client = createClient(mockTransporter);
    const result = await client.status(null);

    expect(result.error?.rpc).toEqual({
      code: -32602,
      message: "Invalid params",
    });
  });

  it("supports runtime validation", () => {
    const client = createClient(mockTransporter, true);

    expect(typeof client.status).toBe("function");
  });
});
