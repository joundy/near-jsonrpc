import {
  removeQuotes,
  addQuote,
  snakeToCamel,
  getOpenApiSpecFromNearcore,
  getOpenApiSpecFromLocal,
} from "./index";
import { readFileSync } from "fs";

// Mock fs module
jest.mock("fs", () => ({
  readFileSync: jest.fn(),
}));

// Mock global fetch
global.fetch = jest.fn();

describe("Utility Functions", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("getOpenApiSpecFromNearcore", () => {
    it("should fetch and return OpenAPI spec from nearcore", async () => {
      const mockSpec =
        '{ "openapi": "3.0.0", "info": { "title": "Test API" } }';
      const mockResponse = {
        text: jest.fn().mockResolvedValue(mockSpec),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      const result = await getOpenApiSpecFromNearcore();

      expect(global.fetch).toHaveBeenCalledWith(
        "https://raw.githubusercontent.com/near/nearcore/refs/heads/master/chain/jsonrpc/openapi/openapi.json"
      );
      expect(mockResponse.text).toHaveBeenCalled();
      expect(result).toBe(mockSpec);
    });

    it("should handle fetch errors", async () => {
      const mockError = new Error("Network error");
      (global.fetch as jest.Mock).mockRejectedValue(mockError);

      await expect(getOpenApiSpecFromNearcore()).rejects.toThrow(
        "Network error"
      );
    });

    it("should handle response.text() errors", async () => {
      const mockResponse = {
        text: jest.fn().mockRejectedValue(new Error("Failed to read response")),
      };
      (global.fetch as jest.Mock).mockResolvedValue(mockResponse);

      await expect(getOpenApiSpecFromNearcore()).rejects.toThrow(
        "Failed to read response"
      );
    });
  });

  describe("getOpenApiSpecFromLocal", () => {
    const mockReadFileSync = readFileSync as jest.MockedFunction<
      typeof readFileSync
    >;

    it("should read and return OpenAPI spec from local file", () => {
      const mockSpec =
        '{ "openapi": "3.0.0", "info": { "title": "Local API" } }';
      mockReadFileSync.mockReturnValue(mockSpec);

      const result = getOpenApiSpecFromLocal();

      expect(mockReadFileSync).toHaveBeenCalledWith("openapi.json", "utf-8");
      expect(result).toBe(mockSpec);
    });

    it("should handle file read errors", () => {
      const mockError = new Error("File not found");
      mockReadFileSync.mockImplementation(() => {
        throw mockError;
      });

      expect(() => getOpenApiSpecFromLocal()).toThrow("File not found");
    });

    it("should handle empty file", () => {
      mockReadFileSync.mockReturnValue("");

      const result = getOpenApiSpecFromLocal();

      expect(result).toBe("");
    });

    it("should handle large file content", () => {
      const largeContent = "x".repeat(10000);
      mockReadFileSync.mockReturnValue(largeContent);

      const result = getOpenApiSpecFromLocal();

      expect(result).toBe(largeContent);
      expect(result.length).toBe(10000);
    });
  });

  describe("removeQuotes", () => {
    it("should remove single quotes from text", () => {
      expect(removeQuotes("'hello'")).toBe("hello");
      expect(removeQuotes("'world'")).toBe("world");
    });

    it("should remove double quotes from text", () => {
      expect(removeQuotes('"hello"')).toBe("hello");
      expect(removeQuotes('"world"')).toBe("world");
    });

    it("should remove mixed quotes from text", () => {
      expect(removeQuotes('"hello\'world"')).toBe("helloworld");
      expect(removeQuotes("'hello\"world'")).toBe("helloworld");
    });

    it("should remove multiple quotes from text", () => {
      expect(removeQuotes('""hello""')).toBe("hello");
      expect(removeQuotes("''world''")).toBe("world");
    });

    it("should handle text without quotes", () => {
      expect(removeQuotes("hello")).toBe("hello");
      expect(removeQuotes("world")).toBe("world");
    });

    it("should handle empty string", () => {
      expect(removeQuotes("")).toBe("");
    });

    it("should handle string with only quotes", () => {
      expect(removeQuotes('""')).toBe("");
      expect(removeQuotes("''")).toBe("");
      expect(removeQuotes("\"'")).toBe("");
    });

    it("should handle quotes in the middle of text", () => {
      expect(removeQuotes('hel"lo')).toBe("hello");
      expect(removeQuotes("wor'ld")).toBe("world");
    });
  });

  describe("addQuote", () => {
    it("should add double quotes around text", () => {
      expect(addQuote("hello")).toBe('"hello"');
      expect(addQuote("world")).toBe('"world"');
    });

    it("should add quotes around empty string", () => {
      expect(addQuote("")).toBe('""');
    });

    it("should add quotes around special characters", () => {
      expect(addQuote("hello@world.com")).toBe('"hello@world.com"');
      expect(addQuote("123-456-789")).toBe('"123-456-789"');
    });

    it("should add quotes around numbers as strings", () => {
      expect(addQuote("123")).toBe('"123"');
      expect(addQuote("0")).toBe('"0"');
    });
  });

  describe("snakeToCamel", () => {
    it("should convert snake_case to camelCase", () => {
      expect(snakeToCamel("hello_world")).toBe("helloWorld");
      expect(snakeToCamel("user_name")).toBe("userName");
      expect(snakeToCamel("api_key_value")).toBe("apiKeyValue");
    });

    it("should convert kebab-case to camelCase", () => {
      expect(snakeToCamel("hello-world")).toBe("helloWorld");
      expect(snakeToCamel("user-name")).toBe("userName");
      expect(snakeToCamel("api-key-value")).toBe("apiKeyValue");
    });

    it("should convert dot.case to camelCase", () => {
      expect(snakeToCamel("hello.world")).toBe("helloWorld");
      expect(snakeToCamel("user.name")).toBe("userName");
      expect(snakeToCamel("api.key.value")).toBe("apiKeyValue");
    });

    it("should handle mixed separators", () => {
      expect(snakeToCamel("hello_world-test.case")).toBe("helloWorldTestCase");
      expect(snakeToCamel("api_key-value.name")).toBe("apiKeyValueName");
    });

    it("should handle strings without separators", () => {
      expect(snakeToCamel("hello")).toBe("hello");
      expect(snakeToCamel("world")).toBe("world");
    });

    it("should handle empty string", () => {
      expect(snakeToCamel("")).toBe("");
    });

    it("should handle single character conversions", () => {
      expect(snakeToCamel("a_b")).toBe("aB");
      expect(snakeToCamel("x-y")).toBe("xY");
      expect(snakeToCamel("m.n")).toBe("mN");
    });

    it("should handle trailing separators", () => {
      expect(snakeToCamel("hello_")).toBe("hello");
      expect(snakeToCamel("world-")).toBe("world");
      expect(snakeToCamel("test.")).toBe("test");
    });

    it("should handle leading separators", () => {
      expect(snakeToCamel("_hello")).toBe("Hello");
      expect(snakeToCamel("-world")).toBe("World");
      expect(snakeToCamel(".test")).toBe("Test");
    });

    it("should handle numbers in the string", () => {
      expect(snakeToCamel("api_v2_key")).toBe("apiV2Key");
      expect(snakeToCamel("user_123_name")).toBe("user123Name");
      expect(snakeToCamel("test_2_case")).toBe("test2Case");
    });

    it("should preserve existing camelCase", () => {
      expect(snakeToCamel("helloWorld")).toBe("helloWorld");
      expect(snakeToCamel("userName")).toBe("userName");
    });
  });
});
