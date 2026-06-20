// IMPORTS

import { useEffect, useState } from "react";
import { useLoaderData,  useFetcher} from "react-router";
import { authenticate } from "../shopify.server";
import { getProductEditUrl } from "../config";
import { SaveDiscardBar } from "../components/SaveDiscardBar";


//Loader  
export const loader = async ({ request, params }) => {
  const { handle } = params;

  if (!handle) {
    throw new Response("Handle is required to load product", { status: 400 });
  }
  let admin;
  let session;
  try {
    ({ admin, session } = await authenticate.admin(request));
  } catch (error) {
    throw new Response("Unauthorized session", { status: 401 });
  }
  let product;
  try {
    const response = await admin.graphql(`
      #graphql
      query GetProducts($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          productType
          descriptionHtml
          vendor
          status
          tags
          variants(first: 1) {
            edges {
              node {
                id
                sku
              }
            }
          }
        }
      }
    `, { variables: { handle } });

    const data = await response.json();
    product = data.data.productByHandle;
  } catch (error) {
    throw new Response("Unable to update product right now. Please try again.", { status: 500 });
  }

  if (!product) {
    throw new Response("Product not found", { status: 404 });
  }
  const cleanProduct = {
    id: product.id,
    handle,
    title: product.title,
    descriptionHtml: product.descriptionHtml || "",
    vendor: product.vendor || "",
    productType: product.productType || "",
    status: product.status,
    tags: product.tags || [],
    sku: product.variants.edges[0]?.node.sku || "",
    variantId: product.variants.edges[0]?.node.id || "",
  };
  const shopDomain = session.shop;
  const url = new URL(request.url);
  const tab = url.searchParams.get("tab");
  if (tab === "siblings") {
    try {
      const siblingResponse = await admin.graphql(`
        #graphql
        query GetSiblings($handle: String!) {
          productByHandle(handle: $handle) {
            metafield(namespace: "codem", key: "sibling_products") {
              value
            }
          }
        }
      `, { variables: { handle } });
      const siblingData = await siblingResponse.json();
      const metafield = siblingData.data.productByHandle?.metafield;
      const raw = metafield?.value;
      const siblingHandles = raw ? JSON.parse(raw) : [];
      const siblingProducts = await Promise.all(
        siblingHandles.map(async (sibHandle) => {
          const res = await admin.graphql(`
            #graphql
            query GetSibling($handle: String!) {
              productByHandle(handle: $handle) {
                title
                handle
                featuredImage { url }
                variants(first: 1) {
                  edges { node { sku } }
                }
              }
            }
          `, { variables: { handle: sibHandle } });
          const d = await res.json();
          const p = d.data.productByHandle;
          if (!p) return null;

          return {
            handle: p.handle,
            title: p.title,
            image: p.featuredImage?.url || null,
            sku: p.variants.edges[0]?.node.sku || "",
          };
        })
      );
      return {
        product: cleanProduct,
        shopDomain,
        siblings: siblingProducts.filter(Boolean),
      };
    } catch (error) {
      return {
        product: cleanProduct,
        shopDomain,
        error: "Unable to load sibling tab data right now. Please try again.",
      };
    }
  }
  return { product: cleanProduct, shopDomain };
};
const normalizeTags = (raw) =>
  [...new Set(
    (raw || "")
      .split(",")
      .map((t) => t.trim().toLowerCase())
      .filter(Boolean)
  )].sort();
export const action = async ({ request, params }) => {
  const { handle } = params;
  if (!handle) {
    return { error: "Handle is required to update product" };
  }
  let admin;
  try {
    ({ admin } = await authenticate.admin(request));
  } catch (error) {
    return { error: "Unauthorized session" };
  }
  const formData = await request.formData();
  const _tab = formData.get("_tab");
  if (!_tab) {
    return { error: "Invalid product payload" };
  }
  if (!["basicInfo", "siblings", "saveAll"].includes(_tab)) {
    return { error: "Unsupported tab" };
  }
  if (_tab === "basicInfo") {
    return await handleBasicInfo(formData, admin);
  }
  if (_tab === "siblings") {
    return await handleSiblings(formData, admin);
  }
  if (_tab === "saveAll") {
    const basicInfoResult = await handleBasicInfo(formData, admin);

    if (basicInfoResult?.error) {
      return basicInfoResult;
    }

    const siblingHandlesRaw = formData.get("siblingHandles");
    if (siblingHandlesRaw) {
      const siblingsResult = await handleSiblings(formData, admin);
      if (siblingsResult?.error) {
        return siblingsResult;
      }
    }

    return { success: true };
  }

  return { success: true };
};
async function handleBasicInfo(formData, admin) {
  const title           = formData.get("title");
  const sku             = formData.get("sku");
  const vendor          = formData.get("vendor");
  const productType     = formData.get("productType");
  const description     = formData.get("description");
  const tags            = formData.get("tags");
  const status          = formData.get("status");
  const originalTitle   = formData.get("originalTitle");
  const originalSku     = formData.get("originalSku");
  const originalVendor  = formData.get("originalVendor");
  const originalProductType = formData.get("originalProductType");
  const originalDescription = formData.get("originalDescription");
  const originalTags    = formData.get("originalTags");
  const originalStatus  = formData.get("originalStatus");
  const productId       = formData.get("productId");
  const variantId       = formData.get("variantId");

  if (
    typeof title  !== "string" ||
    typeof vendor !== "string" ||
    typeof tags   !== "string" ||
    !productId ||
    !variantId
  ) {
    return { error: "Invalid product payload" };
  }

  const trimmedTitle = title.trim();
  if (trimmedTitle.length < 3 || trimmedTitle.length > 200) {
     return { error: "Title must be at least 3 characters." };
  }

  if (vendor.trim().length === 0) {
      return { error: "Vendor is required." };
  }

  const currentTagsNormalized  = normalizeTags(tags);
  const originalTagsNormalized = normalizeTags(originalTags);
  const tagsChanged =
    JSON.stringify(currentTagsNormalized) !== JSON.stringify(originalTagsNormalized);

  const hasBasicInfoChanged =
    title       !== originalTitle       ||
    vendor      !== originalVendor      ||
    productType !== originalProductType ||
    description !== originalDescription ||
    tagsChanged ||
    status      !== originalStatus;

  const hasSkuChanged = sku !== originalSku;

  if (!hasBasicInfoChanged && !hasSkuChanged) {
    return { success: true, message: "No changes detected" };
  }

  if (hasSkuChanged && sku) {
    const skuLookupResponse = await admin.graphql(`
      #graphql
      query CheckSkuUnique($query: String!) {
        productVariants(first: 1, query: $query) {
          edges {
            node {
              id
              sku
              product { id }
            }
          }
        }
      }
    `, { variables: { query: `sku:${JSON.stringify(sku)}` } });

    const skuLookupData  = await skuLookupResponse.json();
    const existingVariant = skuLookupData?.data?.productVariants?.edges?.[0]?.node;

    if (existingVariant && existingVariant.id !== variantId) {
      return { error: `SKU "${sku}" is already used by another product.` };
    }
  }

  if (hasBasicInfoChanged) {
    const changedProduct = { id: productId };

    if (title       !== originalTitle)       changedProduct.title          = title;
    if (vendor      !== originalVendor)      changedProduct.vendor         = vendor;
    if (description !== originalDescription) changedProduct.descriptionHtml = description;
    if (productType !== originalProductType) changedProduct.productType    = productType;
    if (tagsChanged)                         changedProduct.tags           = currentTagsNormalized;
    if (status      !== originalStatus)      changedProduct.status         = status;

    const productResponse = await admin.graphql(`
      #graphql
      mutation UpdateProduct($product: ProductUpdateInput!) {
        productUpdate(product: $product) {
          product { 
            id
            title 
            vendor
            status 
            description 
            tags }
          userErrors { 
             field 
             message
              }
        }
      }
    `, { variables: { product: changedProduct } });

    const productData = await productResponse.json();
    const userErrors  = productData.data.productUpdate.userErrors;
    if (userErrors.length > 0) {
      return { error: "Unable to update product right now. Please try again." };
    }
  }

  if (hasSkuChanged) {
    const variantResponse = await admin.graphql(`
      #graphql
      mutation UpdateVariant(
        $productId: ID!
        $variants: [ProductVariantsBulkInput!]!
      ) {
        productVariantsBulkUpdate(productId: $productId, variants: $variants) {
          productVariants { id sku }
          userErrors { field message }
        }
      }
    `, {
      variables: {
        productId,
        variants: [{ id: variantId, inventoryItem: { sku } }],
      },
    });

    const variantData   = await variantResponse.json();
    const variantErrors = variantData.data.productVariantsBulkUpdate.userErrors;

    if (variantErrors.length > 0) {
      const hasKeyword = (error, keyword) => {
        const fields = error.field || [];
        return (
          fields.some(f => f?.toLowerCase()?.includes(keyword)) ||
          error.message?.toLowerCase()?.includes(keyword)
        );
      };
      const skuError = variantErrors.find(e => hasKeyword(e, "sku"));
      if (skuError) {
        return { error: `SKU "${sku}" is already used by another product.` };
      }
      return { error: "Unable to update product right now. Please try again." };
    }
  }

  return { success: true };
}
async function handleSiblings(formData, admin) {
  const siblingHandlesRaw         = formData.get("siblingHandles");
  const originalSiblingHandlesRaw = formData.get("originalSiblingHandles");
  const productId                 = formData.get("productId");

  if (!siblingHandlesRaw || !productId) {
    return { error: "Invalid product payload" };
  }

  let siblingHandles;
  try {
    siblingHandles = JSON.parse(siblingHandlesRaw);
    if (!Array.isArray(siblingHandles)) {
      return { error: "Invalid product payload" };
    }
  } catch (e) {
    return { error: "Invalid product payload" };
  }

  if (originalSiblingHandlesRaw) {
    try {
      const originalSiblingHandles = JSON.parse(originalSiblingHandlesRaw);
      const sortedCurrent  = [...siblingHandles].sort();
      const sortedOriginal = [...originalSiblingHandles].sort();
      if (JSON.stringify(sortedCurrent) === JSON.stringify(sortedOriginal)) {
        return { success: true, message: "No changes detected" };
      }
    } catch (e) {
     
    }
  }

  try {
    const response = await admin.graphql(`
      #graphql
      mutation SaveSiblings($metafields: [MetafieldsSetInput!]!) {
        metafieldsSet(metafields: $metafields) {
          metafields { id value }
          userErrors { field message }
        }
      }
    `, {
      variables: {
        metafields: [{
          ownerId:   productId,
          namespace: "codem",
          key:       "sibling_products",
          value:     JSON.stringify(siblingHandles),
          type:      "json",
        }],
      },
    });

    const data   = await response.json();
    const errors = data.data.metafieldsSet.userErrors;

    if (errors.length > 0) {
      return { error: "Unable to update product right now. Please try again." };
    }

    return { success: true };
  } catch (error) {
    return { error: "Unable to update product right now. Please try again." };
  }
}
export default function ProductEditPage() {
  const { product, shopDomain } = useLoaderData();
  const fetcher = useFetcher();
  const siblingFetcher = useFetcher();
  const [activeTab, setActiveTab] = useState("basicInfo");
  const [title, setTitle] = useState(product?.title || "");
  const [sku, setSku] = useState(product?.sku || "");
  const [vendor, setVendor] = useState(product?.vendor || "");
  const [productType, setProductType] = useState(product?.productType || "");
  const [description, setDescription] = useState(product?.descriptionHtml || "");
  let initialTags = "";
if (Array.isArray(product?.tags)) {
  initialTags = product.tags.join(", ");
} else {
  initialTags = product?.tags || "";
}
   const [tags, setTags] = useState(initialTags);
  const [status, setStatus] = useState(product?.status || "");
  const [siblingHandles, setSiblingHandles] = useState([]);
  const [originalSnap, setOriginalSnap] = useState({
            title:  product?.title || "",
            sku:    product?.sku || "",
            vendor:   product?.vendor || "",
            productType: product?.productType || "",
            description: product?.descriptionHtml || "",
            tags:  Array.isArray(product?.tags) ? product.tags.join(", ") : product?.tags || "",
            status:  product?.status || "",
            siblingHandles: null,
  });
  const isDirty =
    title !== originalSnap.title ||
    sku !== originalSnap.sku ||
    vendor !== originalSnap.vendor ||
    productType !== originalSnap.productType ||
    description !== originalSnap.description ||
    tags !== originalSnap.tags ||
    status !== originalSnap.status ||
    (originalSnap.siblingHandles !== null &&
      JSON.stringify(siblingHandles) !== JSON.stringify(originalSnap.siblingHandles));

  useEffect(() => {
    if (activeTab === "siblings" && !siblingFetcher.data) {
      siblingFetcher.load(`/app/products/${product.handle}/edit?tab=siblings`);
    }
  }, [activeTab, product.handle]);
  useEffect(() => {
    if (siblingFetcher.data?.siblings && originalSnap.siblingHandles === null) {
      const handles = siblingFetcher.data.siblings.map((s) => s.handle);
      setSiblingHandles(handles);
      setOriginalSnap((prev) => ({ ...prev, siblingHandles: handles }));
    }
  }, [siblingFetcher.data]);
  useEffect(() => {
  if (fetcher.data?.success) {
    setOriginalSnap((prev) => ({
      ...prev,
      title,
      sku,
      vendor,
      productType,
      description,
      tags,
      status,
    }));
  }
}, [fetcher.data]); 
  const handleDiscard = () => {
    setTitle(originalSnap.title);
    setSku(originalSnap.sku);
    setVendor(originalSnap.vendor);
    setProductType(originalSnap.productType);
    setDescription(originalSnap.description);
    setTags(originalSnap.tags);
    setStatus(originalSnap.status);
    setSiblingHandles(originalSnap.siblingHandles ?? []);
  };
  const handleSave = () => {
    const payload = {
      _tab:"saveAll",
      title,
      sku,
      vendor,
      productType,
      description,
      tags,
      status,
      originalTitle:originalSnap.title,
      originalSku: originalSnap.sku,
      originalVendor: originalSnap.vendor,
      originalProductType:originalSnap.productType,
      originalDescription:originalSnap.description,
      originalTags:originalSnap.tags,
      originalStatus:originalSnap.status,
      productId:product.id,
      variantId:product.variantId,
    };

    if (originalSnap.siblingHandles !== null) {
      payload.siblingHandles= JSON.stringify(siblingHandles);
      payload.originalSiblingHandles = JSON.stringify(originalSnap.siblingHandles);
    }
    fetcher.submit(payload, { method: "POST" });
  };
  const isSubmitting = fetcher.state === "submitting";
  const visibleSiblings = siblingFetcher.data?.siblings?.filter(
    (s) => siblingHandles.includes(s.handle)
  ) || [];
  return (



    <div style={{ padding: "20px", maxWidth: "800px", margin: "0 auto" }}>

    <h1 style={{ marginBottom: "20px" }}>
   Edit Product: {product.title}  </h1>
          <SaveDiscardBar
            isDirty={isDirty}
            isSubmitting={isSubmitting}
            onSave={handleSave}
            onDiscard={handleDiscard}
            errorMessage={fetcher.data?.error}
            successMessage={
              fetcher.data?.success
                ? fetcher.data?.message || "Saved successfully!"
                : null
            }
          />

<div style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
 
        <button
          type="button"
          onClick={() => setActiveTab("basicInfo")}
          style={{
            padding: "10px 20px",
            backgroundColor: activeTab === "basicInfo" ? "#008060" : "#e0e0e0",
            color: activeTab === "basicInfo" ? "white"   : "black",
            border:  "none",
            borderRadius:"6px",
            cursor: "pointer",
            fontWeight: "bold",
          }}
        >
         Basic Info
        </button>

        <button
          type="button"
          onClick={() => setActiveTab("siblings")}
          style={{
            padding:  "10px 20px",
            backgroundColor: activeTab === "siblings" ? "#008060" : "#e0e0e0",
            color:  activeTab === "siblings" ? "white"   : "black",
            border:"none",
            borderRadius: "6px",
            cursor:"pointer",
            fontWeight:"bold",
          }}
        >
           Siblings
        </button>
      </div>

      {activeTab === "basicInfo" && (
  <div style={{
    backgroundColor: "rgb(249, 249, 249)",
    padding: "20px",
    borderRadius: "8px",
    border: "1px solid #604040",
  }}>
    <div style={{ marginBottom: "15px" }}>
      <label htmlFor="title" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
        Title *
      </label>
      <input id="title" type="text" value={title} onChange={(e) => setTitle(e.target.value)}
        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
    </div>

    <div style={{ marginBottom: "15px" }}>
      <label htmlFor="sku" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
        SKU
      </label>
      <input id="sku" type="text" value={sku} onChange={(e) => setSku(e.target.value)}
        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
    </div>

    <div style={{ marginBottom: "15px" }}>
      <label htmlFor="vendor" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
        Vendor *
      </label>
      <input id="vendor" type="text" value={vendor} onChange={(e) => setVendor(e.target.value)}
        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
    </div>

    <div style={{ marginBottom: "15px" }}>
      <label htmlFor="productType" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
        Product Type
      </label>
      <input id="productType" type="text" value={productType} onChange={(e) => setProductType(e.target.value)}
        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
    </div>

    <div style={{ marginBottom: "15px" }}>
      <label htmlFor="description" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
        Description
      </label>
      <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}
        rows={4} style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
    </div>

    <div style={{ marginBottom: "15px" }}>
      <label htmlFor="tags" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
        Tags
      </label>
      <input id="tags" type="text" value={tags} onChange={(e) => setTags(e.target.value)}
        placeholder="phone, android, samsung"
        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }} />
      <small style={{ color: "#888" }}>Comma separated</small>
    </div>

    <div style={{ marginBottom: "15px" }}>
      <label htmlFor="status" style={{ display: "block", marginBottom: "5px", fontWeight: "bold" }}>
        Status
      </label>
      <select id="status" value={status} onChange={(e) => setStatus(e.target.value)}
        style={{ width: "100%", padding: "8px", borderRadius: "4px", border: "1px solid #ccc" }}>
        <option value="ACTIVE">Active</option>
        <option value="DRAFT">Draft</option>
        <option value="ARCHIVED">Archived</option>
      </select>
    </div>

  </div>
)}

      {activeTab === "siblings" && (
        <div style={{
          backgroundColor: "#f9f9f9",
          padding:         "20px",
          borderRadius:    "8px",
          border:          "1px solid #e0e0e0",
        }}>
          <h2> Siblings Products</h2>

          {siblingFetcher.state === "loading" && (
            <p> Loading siblings...</p>
          )}

          {siblingFetcher.data?.error && (
            <div style={{
              padding:         "10px",
              backgroundColor: "#fff8e1",
              border:          "1px solid orange",
              borderRadius:    "6px",
              color:           "orange",
              marginBottom:    "10px",
            }}>
               {siblingFetcher.data.error}
            </div>
          )}

          {siblingFetcher.data?.siblings?.length === 0 && (
            <p style={{ color: "#888" }}>No sibling products found.</p>
          )}

          {visibleSiblings.map((sibling) => (
            <div key={sibling.handle} style={{
              display:"flex",
              alignItems: "center",
              gap: "15px",
              padding:"10px",
              backgroundColor: "white",
              borderRadius:"6px",
              border:"1px solid #e0e0e0",
              marginBottom: "10px",
            }}>
              {sibling.image ? (
                <img
                  src={sibling.image}
                  alt={sibling.title}
                  style={{ width: "50px", height: "50px", objectFit: "cover", borderRadius: "4px" }}
                />
              ) : (
                <div style={{
                  width:           "50px",
                  height:          "50px",
                  backgroundColor: "#e0e0e0",
                  borderRadius:    "4px",
                  display:         "flex",
                  alignItems:      "center",
                  justifyContent:  "center",
                }}>
                  
                </div>
              )}

              <div style={{ flex: 1 }}>
                <p style={{ margin: 0, fontWeight: "bold" }}>{sibling.title}</p>
                <p style={{ margin: 0, color: "#888", fontSize: "14px" }}>
                  SKU: {sibling.sku || "No SKU"}
                </p>
              </div>

              <button
                type="button"
                onClick={() => window.open(getProductEditUrl(shopDomain, sibling.handle), "_blank")}
                style={{
                  padding:         "6px 12px",
                  backgroundColor: "#008060",
                  color:           "white",
                  border:          "none",
                  borderRadius:    "4px",
                  cursor:          "pointer",
                }}
              >
                Open
              </button>

              <button
                type="button"
                onClick={() =>
                  setSiblingHandles(siblingHandles.filter((h) => h !== sibling.handle))
                }
                style={{
                  padding:         "6px 12px",
                  backgroundColor: "#d82c0d",
                  color:           "white",
                  border:          "none",
                  borderRadius:    "4px",
                  cursor:          "pointer",
                }}
              >
                Remove
              </button>
            </div>
          ))}

        </div>
      )}

    </div>
  );
} 



