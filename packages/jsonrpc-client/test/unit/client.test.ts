import { createClient, createClientWithMethods } from "../../src/client";
import { block, status, gasPrice, query } from "@near-js/jsonrpc-types/methods";
import type { Transporter } from "../../src/types";

describe("createClient", () => {
  let mockTransporter: jest.MockedFunction<Transporter>;

  beforeEach(() => {
    mockTransporter = jest.fn();
  });

  it("creates a client with RPC methods", () => {
    const client = createClient({ transporter: mockTransporter });

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

    const client = createClient({ transporter: mockTransporter });
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

    const client = createClient({ transporter: mockTransporter });
    const result = await client.status(null);

    expect(result.error?.rpc).toEqual({
      code: -32602,
      message: "Invalid params",
    });
  });

  it("supports runtime validation", () => {
    const client = createClient({
      transporter: mockTransporter,
      runtimeValidation: true,
    });

    expect(typeof client.status).toBe("function");
  });
});

describe("createClientWithMethods", () => {
  let mockTransporter: jest.MockedFunction<Transporter>;

  beforeEach(() => {
    mockTransporter = jest.fn();
    mockTransporter.mockResolvedValue({
      result: { test: "data" },
      error: null,
    });
  });

  it("should create client with only specified method objects", () => {
    const client = createClientWithMethods({
      transporter: mockTransporter,
      methods: {
        block,
        query,
      },
    });

    // Should have specified methods
    expect(typeof client.block).toBe("function");
    expect(typeof client.query).toBe("function");

    // Should not have unspecified methods
    expect((client as any).status).toBeUndefined();
    expect((client as any).gasPrice).toBeUndefined();
  });

  it("should work with the specified methods", async () => {
    const client = createClientWithMethods({
      transporter: mockTransporter,
      methods: { status },
    });

    const result = await client.status(null);
    expect(result).toEqual({ result: { test: "data" }, error: null });
  });

  it("should call transporter with correct method name", async () => {
    const client = createClientWithMethods({
      transporter: mockTransporter,
      methods: { block },
    });

    await client.block({ finality: "final" });

    expect(mockTransporter).toHaveBeenCalledWith(
      "block",
      expect.objectContaining({ finality: "final" })
    );
  });

  it("should work with multiple methods", () => {
    const client = createClientWithMethods({
      transporter: mockTransporter,
      methods: { block, status, gasPrice },
    });

    expect(typeof client.block).toBe("function");
    expect(typeof client.status).toBe("function");
    expect(typeof client.gasPrice).toBe("function");
    expect((client as any).query).toBeUndefined();
  });

  it("should enable validation when specified", async () => {
    const client = createClientWithMethods({
      transporter: mockTransporter,
      methods: { status },
      runtimeValidation: true,
    });

    const result = await client.status(null);
    expect(result).toBeDefined();
  });

  it("should work without validation parameter", async () => {
    const client = createClientWithMethods({
      transporter: mockTransporter,
      methods: { status },
    });

    const result = await client.status(null);
    expect(result).toBeDefined();
  });

  it("should handle RPC errors", async () => {
    mockTransporter.mockResolvedValue({
      result: null,
      error: { code: -32600, message: "Invalid Request" },
    });

    const client = createClientWithMethods({
      transporter: mockTransporter,
      methods: { status },
    });

    const result = await client.status(null);

    expect(result).toEqual({
      error: {
        rpc: { code: -32600, message: "Invalid Request" },
      },
    });
  });
});
