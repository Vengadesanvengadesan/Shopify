
export const APP_HANDLE = "venky-5";
export function getProductEditPath(productHandle) {
  return `apps/${APP_HANDLE}/app/products/${productHandle}/edit`;
}
export function getProductEditUrl(shopDomain, productHandle) {
  const storeName = shopDomain.replace(".myshopify.com", "");
  return `https://admin.shopify.com/store/${storeName}/${getProductEditPath(productHandle)}`;
}
