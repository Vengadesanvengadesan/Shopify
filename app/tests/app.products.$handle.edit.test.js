
import { describe, it, expect, vi, beforeEach } from "vitest";
import { loader, action } from "../routes/app.products.$handle.edit";


const mockGraphql = vi.fn();

vi.mock("../shopify.server", () => ({
  authenticate: {
    admin: vi.fn(async () => ({
      admin: { graphql: mockGraphql },
      session: { shop: "test-store.myshopify.com" },
    })),
  },
}));

beforeEach(() => {
  mockGraphql.mockReset();
});

// Helper: build a Request with form data for the action
function buildPostRequest(fields) {
  const formData = new FormData();
  for (const [key, value] of Object.entries(fields)) {
    formData.append(key, value);
  }
  return new Request("https://test.com/app/products/test-handle/edit", {
    method: "POST",
    body: formData,
  });
}

// Helper: mock a graphql response
function jsonResponse(payload) {
  return { json: async () => payload };
}

// ═══════════════════════════════════════════════════════════════
// LOADER TESTS
// ═══════════════════════════════════════════════════════════════
describe("loader", () => {
  it("E-01: throws when handle param is missing", async () => {
    const request = new Request("https://test.com/app/products//edit");
    try {
      await loader({ request, params: {} });
      throw new Error("loader did not throw");
    } catch (response) {
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(400);
      const text = await response.text();
      expect(text).toBe("Handle is required to load product");
    }
  });

  it("E-04: throws Product not found when API returns null", async () => {
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({ data: { productByHandle: null } })
    );
    const request = new Request("https://test.com/app/products/missing/edit");
    try {
      await loader({ request, params: { handle: "missing" } });
      throw new Error("loader did not throw");
    } catch (response) {
      expect(response).toBeInstanceOf(Response);
      expect(response.status).toBe(404);
      const text = await response.text();
      expect(text).toBe("Product not found");
    }
  });

  it("returns a clean product payload on success (no lazy-tab data)", async () => {
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({
        data: {
          productByHandle: {
            id: "gid://shopify/Product/1",
            title: "Samsung Galaxy S24",
            productType: "Phone",
            descriptionHtml: "<p>desc</p>",
            vendor: "Samsung",
            status: "ACTIVE",
            tags: ["phone", "android"],
            variants: { edges: [{ node: { id: "gid://shopify/ProductVariant/1", sku: "SAM-001" } }] },
          },
        },
      })
    );
    const request = new Request("https://test.com/app/products/samsung-galaxy-s24/edit");
    const result = await loader({ request, params: { handle: "samsung-galaxy-s24" } });

    expect(result.product.title).toBe("Samsung Galaxy S24");
    expect(result.product.sku).toBe("SAM-001");
    expect(result.product.tags).toEqual(["phone", "android"]);
    // AC: loader must never return lazy-tab (siblings) data by default
    expect(result.siblings).toBeUndefined();
  });

  it("returns siblings when ?tab=siblings is requested", async () => {
    // 1st call: main product query
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({
        data: {
          productByHandle: {
            id: "gid://shopify/Product/1",
            title: "Samsung Galaxy S24",
            productType: "Phone",
            descriptionHtml: "",
            vendor: "Samsung",
            status: "ACTIVE",
            tags: [],
            variants: { edges: [{ node: { id: "gid://shopify/ProductVariant/1", sku: "SAM-001" } }] },
          },
        },
      })
    );
    // 2nd call: sibling metafield query
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({
        data: {
          productByHandle: {
            metafield: { value: JSON.stringify(["sibling-handle-1"]) },
          },
        },
      })
    );
    // 3rd call: sibling detail query
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({
        data: {
          productByHandle: {
            title: "Sibling Product",
            handle: "sibling-handle-1",
            featuredImage: { url: "https://example.com/img.png" },
            variants: { edges: [{ node: { sku: "SIB-001" } }] },
          },
        },
      })
    );

    const request = new Request("https://test.com/app/products/samsung-galaxy-s24/edit?tab=siblings");
    const result = await loader({ request, params: { handle: "samsung-galaxy-s24" } });

    expect(result.siblings).toHaveLength(1);
    expect(result.siblings[0].handle).toBe("sibling-handle-1");
    expect(result.siblings[0].sku).toBe("SIB-001");
  });

  it("E-08: returns caution error when sibling fetch fails, but still returns product", async () => {
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({
        data: {
          productByHandle: {
            id: "gid://shopify/Product/1",
            title: "Samsung Galaxy S24",
            productType: "Phone",
            descriptionHtml: "",
            vendor: "Samsung",
            status: "ACTIVE",
            tags: [],
            variants: { edges: [{ node: { id: "gid://shopify/ProductVariant/1", sku: "SAM-001" } }] },
          },
        },
      })
    );
    // sibling metafield query throws
    mockGraphql.mockRejectedValueOnce(new Error("network error"));

    const request = new Request("https://test.com/app/products/samsung-galaxy-s24/edit?tab=siblings");
    const result = await loader({ request, params: { handle: "samsung-galaxy-s24" } });

    expect(result.error).toBe("Unable to load sibling tab data right now. Please try again.");
    expect(result.product.title).toBe("Samsung Galaxy S24"); // AC07: product still returned
  });
});

// ═══════════════════════════════════════════════════════════════
// ACTION TESTS — BASIC INFO TAB
// ═══════════════════════════════════════════════════════════════
describe("action - basicInfo", () => {
  it("E-02: returns error when handle is missing", async () => {
    const request = buildPostRequest({ _tab: "basicInfo" });
    const result = await action({ request, params: {} });
    expect(result.error).toBe("Handle is required to update product");
  });

  it("E-05: returns error when _tab is missing", async () => {
    const request = buildPostRequest({});
    const result = await action({ request, params: { handle: "test" } });
    expect(result.error).toBe("Invalid product payload");
  });

  it("E-06: returns error for an unsupported tab value", async () => {
    const request = buildPostRequest({ _tab: "unknownTab" });
    const result = await action({ request, params: { handle: "test" } });
    expect(result.error).toBe("Unsupported tab");
  });

  it("E-05: returns error when required fields are missing types", async () => {
    const request = buildPostRequest({
      _tab: "basicInfo",
      title: "Valid Title",
      vendor: "Samsung",
      tags: "phone",
      // productId / variantId missing
    });
    const result = await action({ request, params: { handle: "test" } });
    expect(result.error).toBe("Invalid product payload");
  });

  it("AC05: no-op save fires zero GraphQL mutations when nothing changed", async () => {
    const request = buildPostRequest({
      _tab: "basicInfo",
      title: "Samsung Galaxy S24",
      sku: "SAM-001",
      vendor: "Samsung",
      productType: "Phone",
      description: "<p>desc</p>",
      tags: "phone, android",
      status: "ACTIVE",
      originalTitle: "Samsung Galaxy S24",
      originalSku: "SAM-001",
      originalVendor: "Samsung",
      originalProductType: "Phone",
      originalDescription: "<p>desc</p>",
      originalTags: "phone, android",
      originalStatus: "ACTIVE",
      productId: "gid://shopify/Product/1",
      variantId: "gid://shopify/ProductVariant/1",
    });

    const result = await action({ request, params: { handle: "test" } });

    expect(result.success).toBe(true);
    expect(result.message).toBe("No changes detected");
    expect(mockGraphql).not.toHaveBeenCalled();
  });

  it("AC05: tag reordering/whitespace alone does NOT trigger a mutation", async () => {
    const request = buildPostRequest({
      _tab: "basicInfo",
      title: "Samsung Galaxy S24",
      sku: "SAM-001",
      vendor: "Samsung",
      productType: "Phone",
      description: "<p>desc</p>",
      tags: "Android,  Phone ", // different order/case/whitespace
      status: "ACTIVE",
      originalTitle: "Samsung Galaxy S24",
      originalSku: "SAM-001",
      originalVendor: "Samsung",
      originalProductType: "Phone",
      originalDescription: "<p>desc</p>",
      originalTags: "phone, android",
      originalStatus: "ACTIVE",
      productId: "gid://shopify/Product/1",
      variantId: "gid://shopify/ProductVariant/1",
    });

    const result = await action({ request, params: { handle: "test" } });

    expect(result.success).toBe(true);
    expect(result.message).toBe("No changes detected");
    expect(mockGraphql).not.toHaveBeenCalled();
  });

  it("AC03: fires productUpdate only when core fields changed (SKU unchanged)", async () => {
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({ data: { productUpdate: { product: { id: "1", title: "New Title" }, userErrors: [] } } })
    );

    const request = buildPostRequest({
      _tab: "basicInfo",
      title: "New Title",
      sku: "SAM-001",
      vendor: "Samsung",
      productType: "Phone",
      description: "<p>desc</p>",
      tags: "phone, android",
      status: "ACTIVE",
      originalTitle: "Samsung Galaxy S24",
      originalSku: "SAM-001",
      originalVendor: "Samsung",
      originalProductType: "Phone",
      originalDescription: "<p>desc</p>",
      originalTags: "phone, android",
      originalStatus: "ACTIVE",
      productId: "gid://shopify/Product/1",
      variantId: "gid://shopify/ProductVariant/1",
    });

    const result = await action({ request, params: { handle: "test" } });

    expect(result.success).toBe(true);
    // Only ONE graphql call: productUpdate. No SKU check, no variantsBulkUpdate.
    expect(mockGraphql).toHaveBeenCalledTimes(1);
    const calledQuery = mockGraphql.mock.calls[0][0];
    expect(calledQuery).toContain("productUpdate");
  });

  it("AC06/E-09: rejects duplicate SKU BEFORE firing any mutation", async () => {
    // SKU uniqueness check finds a conflicting variant
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({
        data: {
          productVariants: {
            edges: [{ node: { id: "gid://shopify/ProductVariant/999", sku: "DUPLICATE-SKU", product: { id: "gid://shopify/Product/999" } } }],
          },
        },
      })
    );

    const request = buildPostRequest({
      _tab: "basicInfo",
      title: "Samsung Galaxy S24",
      sku: "DUPLICATE-SKU",
      vendor: "Samsung",
      productType: "Phone",
      description: "<p>desc</p>",
      tags: "phone, android",
      status: "ACTIVE",
      originalTitle: "Samsung Galaxy S24",
      originalSku: "SAM-001", // different from current → SKU changed
      originalVendor: "Samsung",
      originalProductType: "Phone",
      originalDescription: "<p>desc</p>",
      originalTags: "phone, android",
      originalStatus: "ACTIVE",
      productId: "gid://shopify/Product/1",
      variantId: "gid://shopify/ProductVariant/1",
    });

    const result = await action({ request, params: { handle: "test" } });

    expect(result.error).toBe('SKU "DUPLICATE-SKU" is already used by another product.');
    // CRITICAL: only the read-only uniqueness check ran — no write mutation fired
    expect(mockGraphql).toHaveBeenCalledTimes(1);
    const calledQuery = mockGraphql.mock.calls[0][0];
    expect(calledQuery).toContain("query CheckSkuUnique");
    expect(calledQuery).not.toContain("productVariantsBulkUpdate");
  });

  it("AC03: fires variantsBulkUpdate when SKU changed and is unique", async () => {
    // SKU uniqueness check — no conflict found
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({ data: { productVariants: { edges: [] } } })
    );
    // variantsBulkUpdate mutation
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({
        data: { productVariantsBulkUpdate: { productVariants: [{ id: "1", sku: "NEW-SKU" }], userErrors: [] } },
      })
    );

    const request = buildPostRequest({
      _tab: "basicInfo",
      title: "Samsung Galaxy S24",
      sku: "NEW-SKU",
      vendor: "Samsung",
      productType: "Phone",
      description: "<p>desc</p>",
      tags: "phone, android",
      status: "ACTIVE",
      originalTitle: "Samsung Galaxy S24",
      originalSku: "SAM-001",
      originalVendor: "Samsung",
      originalProductType: "Phone",
      originalDescription: "<p>desc</p>",
      originalTags: "phone, android",
      originalStatus: "ACTIVE",
      productId: "gid://shopify/Product/1",
      variantId: "gid://shopify/ProductVariant/1",
    });

    const result = await action({ request, params: { handle: "test" } });

    expect(result.success).toBe(true);
    expect(mockGraphql).toHaveBeenCalledTimes(2);
    expect(mockGraphql.mock.calls[0][0]).toContain("query CheckSkuUnique");
    expect(mockGraphql.mock.calls[1][0]).toContain("productVariantsBulkUpdate");
  });

  it("fires BOTH productUpdate and variantsBulkUpdate when core fields + SKU changed", async () => {
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({ data: { productVariants: { edges: [] } } }) // SKU check - unique
    );
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({ data: { productUpdate: { product: { id: "1", title: "New Title" }, userErrors: [] } } })
    );
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({ data: { productVariantsBulkUpdate: { productVariants: [], userErrors: [] } } })
    );

    const request = buildPostRequest({
      _tab: "basicInfo",
      title: "New Title",
      sku: "NEW-SKU",
      vendor: "Samsung",
      productType: "Phone",
      description: "<p>desc</p>",
      tags: "phone, android",
      status: "ACTIVE",
      originalTitle: "Samsung Galaxy S24",
      originalSku: "SAM-001",
      originalVendor: "Samsung",
      originalProductType: "Phone",
      originalDescription: "<p>desc</p>",
      originalTags: "phone, android",
      originalStatus: "ACTIVE",
      productId: "gid://shopify/Product/1",
      variantId: "gid://shopify/ProductVariant/1",
    });

    const result = await action({ request, params: { handle: "test" } });

    expect(result.success).toBe(true);
    expect(mockGraphql).toHaveBeenCalledTimes(3);
    expect(mockGraphql.mock.calls[0][0]).toContain("query CheckSkuUnique");
    expect(mockGraphql.mock.calls[1][0]).toContain("productUpdate");
    expect(mockGraphql.mock.calls[2][0]).toContain("productVariantsBulkUpdate");
  });

  it("E-07: returns transient error when productUpdate returns userErrors", async () => {
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({
        data: { productUpdate: { product: null, userErrors: [{ field: ["title"], message: "Something went wrong" }] } },
      })
    );

    const request = buildPostRequest({
      _tab: "basicInfo",
      title: "New Title",
      sku: "SAM-001",
      vendor: "Samsung",
      productType: "Phone",
      description: "<p>desc</p>",
      tags: "phone, android",
      status: "ACTIVE",
      originalTitle: "Samsung Galaxy S24",
      originalSku: "SAM-001",
      originalVendor: "Samsung",
      originalProductType: "Phone",
      originalDescription: "<p>desc</p>",
      originalTags: "phone, android",
      originalStatus: "ACTIVE",
      productId: "gid://shopify/Product/1",
      variantId: "gid://shopify/ProductVariant/1",
    });

    const result = await action({ request, params: { handle: "test" } });
    expect(result.error).toBe("Unable to update product right now. Please try again.");
  });
});

// ═══════════════════════════════════════════════════════════════
// ACTION TESTS — SIBLINGS TAB
// ═══════════════════════════════════════════════════════════════
describe("action - siblings", () => {
  it("E-05: returns error when siblingHandles or productId missing", async () => {
    const request = buildPostRequest({ _tab: "siblings" });
    const result = await action({ request, params: { handle: "test" } });
    expect(result.error).toBe("Invalid product payload");
  });

  it("AC05: no-op when sibling handles unchanged from original", async () => {
    const request = buildPostRequest({
      _tab: "siblings",
      siblingHandles: JSON.stringify(["sib-a", "sib-b"]),
      originalSiblingHandles: JSON.stringify(["sib-b", "sib-a"]), // same set, different order
      productId: "gid://shopify/Product/1",
    });

    const result = await action({ request, params: { handle: "test" } });
    expect(result.success).toBe(true);
    expect(result.message).toBe("No changes detected");
    expect(mockGraphql).not.toHaveBeenCalled();
  });

  it("AC04: fires metafieldsSet when sibling handles changed", async () => {
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({ data: { metafieldsSet: { metafields: [{ id: "1", value: "[]" }], userErrors: [] } } })
    );

    const request = buildPostRequest({
      _tab: "siblings",
      siblingHandles: JSON.stringify(["sib-a"]),
      originalSiblingHandles: JSON.stringify(["sib-a", "sib-b"]), // sib-b removed
      productId: "gid://shopify/Product/1",
    });

    const result = await action({ request, params: { handle: "test" } });
    expect(result.success).toBe(true);
    expect(mockGraphql).toHaveBeenCalledTimes(1);
    expect(mockGraphql.mock.calls[0][0]).toContain("metafieldsSet");
  });

  it("E-07: returns transient error when metafieldsSet returns userErrors", async () => {
    mockGraphql.mockResolvedValueOnce(
      jsonResponse({ data: { metafieldsSet: { metafields: [], userErrors: [{ field: ["value"], message: "bad value" }] } } })
    );

    const request = buildPostRequest({
      _tab: "siblings",
      siblingHandles: JSON.stringify(["sib-a"]),
      originalSiblingHandles: JSON.stringify(["sib-a", "sib-b"]),
      productId: "gid://shopify/Product/1",
    });

    const result = await action({ request, params: { handle: "test" } });
    expect(result.error).toBe("Unable to update product right now. Please try again.");
  });
});
// ═══════════════════════════════════════════════════════════════
// MISSING TESTS — Add these to reach full spec coverage
// ═══════════════════════════════════════════════════════════════

// Inside describe("loader") — E-03
it("E-03: throws Unauthorized session when loader auth fails", async () => {
  const { authenticate } = await import("../shopify.server");
  vi.mocked(authenticate.admin).mockRejectedValueOnce(new Error("unauth"));

  const request = new Request("https://test.com/app/products/test/edit");
  try {
    await loader({ request, params: { handle: "test" } });
    throw new Error("loader did not throw");
  } catch (response) {
    expect(response).toBeInstanceOf(Response);
    expect(response.status).toBe(401);
    const text = await response.text();
    expect(text).toBe("Unauthorized session");
  }
});

// Inside describe("action - basicInfo") — E-03
it("E-03: returns Unauthorized session when action auth fails", async () => {
  const { authenticate } = await import("../shopify.server");
  vi.mocked(authenticate.admin).mockRejectedValueOnce(new Error("unauth"));

  const request = buildPostRequest({ _tab: "basicInfo" });
  const result = await action({ request, params: { handle: "test" } });
  expect(result.error).toBe("Unauthorized session");
});

// Inside describe("action - basicInfo") — E-05 title too short
it("E-05: rejects title shorter than 3 characters", async () => {
  const request = buildPostRequest({
    _tab: "basicInfo",
    title: "AB",
    sku: "SAM-001",
    vendor: "Samsung",
    productType: "Phone",
    description: "",
    tags: "",
    status: "ACTIVE",
    originalTitle: "Samsung Galaxy S24",
    originalSku: "SAM-001",
    originalVendor: "Samsung",
    originalProductType: "Phone",
    originalDescription: "",
    originalTags: "",
    originalStatus: "ACTIVE",
    productId: "gid://shopify/Product/1",
    variantId: "gid://shopify/ProductVariant/1",
  });
  const result = await action({ request, params: { handle: "test" } });
  expect(result.error).toBe("Invalid product payload");
});

// Inside describe("action - basicInfo") — E-05 title too long
it("E-05: rejects title longer than 200 characters", async () => {
  const request = buildPostRequest({
    _tab: "basicInfo",
    title: "A".repeat(201),
    sku: "SAM-001",
    vendor: "Samsung",
    productType: "Phone",
    description: "",
    tags: "",
    status: "ACTIVE",
    originalTitle: "Samsung Galaxy S24",
    originalSku: "SAM-001",
    originalVendor: "Samsung",
    originalProductType: "Phone",
    originalDescription: "",
    originalTags: "",
    originalStatus: "ACTIVE",
    productId: "gid://shopify/Product/1",
    variantId: "gid://shopify/ProductVariant/1",
  });
  const result = await action({ request, params: { handle: "test" } });
  expect(result.error).toBe("Invalid product payload");
});

// Inside describe("action - basicInfo") — E-05 empty vendor
it("E-05: rejects whitespace-only vendor", async () => {
  const request = buildPostRequest({
    _tab: "basicInfo",
    title: "Valid Title",
    sku: "SAM-001",
    vendor: "   ",
    productType: "Phone",
    description: "",
    tags: "",
    status: "ACTIVE",
    originalTitle: "Valid Title",
    originalSku: "SAM-001",
    originalVendor: "Samsung",
    originalProductType: "Phone",
    originalDescription: "",
    originalTags: "",
    originalStatus: "ACTIVE",
    productId: "gid://shopify/Product/1",
    variantId: "gid://shopify/ProductVariant/1",
  });
  const result = await action({ request, params: { handle: "test" } });
  expect(result.error).toBe("Invalid product payload");
});