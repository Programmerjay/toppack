import { importPkg, searchRepo } from "./utils";

describe("importPkg", () => {
  it("should parse a valid package.json file and update tracked packages", async () => {
    const mockResponse = {
      status: 200,
      ok: true,
      json: async () => ({
        content: Buffer.from(
          '{"dependencies": {"packageA": "1.0.0"}, "devDependencies": {"packageB": "2.0.0"}}'
        ).toString("base64"),
      }),
    };
    jest.spyOn(global, "fetch").mockResolvedValueOnce(mockResponse);

    const trackedPackages = {};
    const updatedPackages = await importPkg("https://example.com/repo", trackedPackages);

    expect(updatedPackages).toEqual({
      packageA: 1,
      packageB: 1,
    });
    expect(trackedPackages).toEqual({
      packageA: 1,
      packageB: 1,
    }); // Verify packages are updated in the input object
  });

  it("should handle missing package.json file", async () => {
    const mockResponse = { status: 404 };
    jest.spyOn(global, "fetch").mockResolvedValueOnce(mockResponse);

    try {
      await importPkg("https://example.com/repo", {});
      fail("Expected an error to be thrown");
    } catch (error) {
      expect(error.message).toBe("This project does not contain a package.json file");
    }
  });

  it("should handle invalid JSON data", async () => {
    const mockResponse = {
      status: 200,
      json: async () => ({
        content: "invalid JSON",
      }),
    };
    jest.spyOn(global, "fetch").mockResolvedValueOnce(mockResponse);

    try {
      await importPkg("https://example.com/repo", {});
      fail("Expected an error to be thrown");
    } catch (error) {
      expect(error.message).toContain("Error parsing package.json");
    }
  });
});

describe("searchRepo", () => {
  it("should fetch repositories for valid keywords", async () => {
    const mockResponse = {
      status: 200,
      ok: true,
      json: async () => ({
        items: [{ name: "react", stargazers_count: 100000 }],
      }),
    };
    jest.spyOn(global, "fetch").mockResolvedValueOnce(mockResponse);

    const repositories = await searchRepo("react");

    expect(repositories).toEqual([{ name: "react", stargazers_count: 100000 }]);
  });

  it("should handle errors during the search", async () => {
    const mockResponse = { status: 500 };
    jest.spyOn(global, "fetch").mockResolvedValueOnce(mockResponse);

    try {
      await searchRepo("unknown-keyword");
      fail("Expected an error to be thrown");
    } catch (error) {
      expect(error.message).toBe("Error fetching repositories: Internal Server Error");
    }
  });

  it("should handle empty search results", async () => {
    const mockResponse = {
      status: 200,
      ok: true,
      json: async () => ({ items: [] }),
    };
    jest.spyOn(global, "fetch").mockResolvedValueOnce(mockResponse);

    const repositories = await searchRepo("nonexistent-keyword");

    expect(repositories).toEqual([]);
  });
});
