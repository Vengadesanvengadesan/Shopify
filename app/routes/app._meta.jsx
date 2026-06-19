import { useLoaderData } from "react-router";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin } = await authenticate.admin(request);

  const productId = "gid://shopify/Product/8043561025638";
//CREATE

   await admin.graphql(`
mutation {
  metafieldDefinitionCreate(
    definition: {
      name: "Brand"
      namespace: "custom"
      key: "brand"
      type: "single_line_text_field"
      ownerType: PRODUCT
    }
  ) {
    createdDefinition {
      id
      name
      namespace
      key
    }
    userErrors {
      message
    }
  }
}
// `);


//SET VALUE
// await admin.graphql(`
// mutation {
//   metafieldsSet(
//     metafields: [
//       {
//         ownerId: "gid://shopify/Product/8043561025638"
//         namespace: "custom"
//         key: "brand"
//         value: "Adidas"
//         type: "single_line_text_field"
//       }
//     ]
//   ) {
//     metafields {
//       id
//       value
//     }
//     userErrors {
//       message
//     }
//   }
// }
// `);

// READ_VALUE
// admin.graphql(`
//     query {
//       product(id: "${productId}") {
//         id
//         title
//         metafield(namespace: "custom", key: "brand") {
//           id
//           value
//         }
//       }
//     }
//   `);

//Metafield Delete
// await admin.graphql(`
// mutation {
//   metafieldsDelete(
//     metafields: [
//       {
//         ownerId: "gid://shopify/Product/8043561025638"
//         namespace: "custom"
//         key: "brand"
//       }
//     ]
//   ) {
//     deletedMetafields {
//       key
//       namespace
//     }
//     userErrors {
//       field
//       message
//     }
//   }
// }
// `);

//Entire Metafield Delete
// await admin.graphql(`
// mutation {
//   metafieldDefinitionDelete(
//     id: "gid://shopify/MetafieldDefinition/205313179750"
//   ) {
//     deletedDefinitionId
//     userErrors {
//       message
//     }
//   }
// }
 
// `);


//Accessing Metafield definition id
// query {
//   metafieldDefinitions(first: 50, ownerType: PRODUCT) {
//     nodes {
//       id
//       namespace
//       key
//       name
//     }
//   }
// }

//Accessing Metafield Value id
// query {
//   product(id: "gid://shopify/Product/PRODUCT_ID") {
//     id
//     title
//     metafields(first: 10) {
//       nodes {
//         id
//         namespace
//         key
//         value
//         type
//       }
//     }
//   }
// }

  const response = await admin.graphql(`
    query {
      product(id: "${productId}") {
        id
        title
        metafield(namespace: "custom", key: "brand") {
          id
          value
        }
      }
    }
  `);

  const data = await response.json();

  return {
    product: data.data.product,
  };
};

export default function Index() {
  const { product } = useLoaderData();

  return (
    <div style={{ padding: "20px" }}>
      <h2>{product.title}</h2>

      <p>
        <b>Product ID:</b> {product.id}
      </p>

      <p>
        <b>Brand:</b> {product.metafield?.value}
      </p>
    </div>
  );
}