
import "@shopify/ui-extensions/preact";
import { render } from 'preact';
import { useEffect, useState } from 'preact/hooks';
import { getProductEditPath } from '../../../app/config';

export default async () => {
  render(<Extension />, document.body);
}

function Extension() {
  const { close, data, navigation } = shopify;
  const [handle, setHandle] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

 useEffect(() => {
    (async function getProductHandle() {
      try {
        const productId = data?.selected?.[0]?.id;

        if (!productId) {
          setError("No product selected");
          setLoading(false);
          return;
        }

        const query = {
          query: `query GetProduct($id: ID!) {
            product(id: $id) {
              handle
              title
            }
          }`,
          variables: { id: productId },
        };

        const res = await fetch("shopify:admin/api/graphql.json", {
          method: "POST",
          body: JSON.stringify(query),
        });

        const productData = await res.json();

        if (productData?.errors?.length) {
          setError("Could not find product handle");
          setLoading(false);
          return;
        }

        const productHandle = productData?.data?.product?.handle;

        if (productHandle) {
          setHandle(productHandle);
        } else {
          setError("Could not find product handle");
        }

        setLoading(false);

      } catch (err) {
        console.error("Error fetching product handle:", err);
        setError("Failed to load product");
        setLoading(false);
      }
    })();
  
  }, []);
  const handleEditProduct = () => {
    if (!handle) return;
    const path = getProductEditPath(handle);
    navigation.navigate(path);
    close();
  };

  return (
    <s-admin-action>
      <s-stack direction="block">

        {loading && (
          <s-text> Loading product info...</s-text>
        )}

  
        {error && (
          <s-text> {error}</s-text>
        )}

  
        {!loading && !error && handle && (
          <s-text>
            Ready to edit: {handle}
          </s-text>
        )}

      </s-stack>

      <s-button
        slot="primary-action"
        disabled={!handle || loading}
        onClick={handleEditProduct}
      >
         Edit Product
      </s-button>

     
      <s-button
        slot="secondary-actions"
        onClick={() => close()}
      >
        Close
      </s-button>

    </s-admin-action>
  );
}
