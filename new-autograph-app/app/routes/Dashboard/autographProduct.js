import { authenticate } from "../../shopify.server";

export const autographProduct = async (request) => {
  console.log("===> Getting Streamily Autograph Product...");
  
  const { admin } = await authenticate.admin(request);

  try {
    const response = await admin.graphql(
      `#graphql
      query {
        productByHandle(handle: "autograph-gift-wrap-handle") {
          id
          handle
          title
          variants(first: 20) {
            edges {
              node {
                id
                title
                displayName
                price
              }
            }
          }
          onlineStoreUrl
          publishedAt
        }
      }`,
    );

    const data = await response.json();
    const { productByHandle } = data.data;
    // console.log("productByHandle :", productByHandle);

    const _variants = productByHandle && productByHandle?.variants ? productByHandle.variants.edges: null;
    const _handle = productByHandle && productByHandle?.handle ? productByHandle.handle : null;
    const _productId = productByHandle && productByHandle?.id ? productByHandle.id : null;
    const _title = productByHandle && productByHandle?.title ? productByHandle.title : null;
    const _onlineStoreUrl = productByHandle && productByHandle?.onlineStoreUrl ? productByHandle.onlineStoreUrl : null;
    const _publishedAt = productByHandle && productByHandle?.publishedAt ? productByHandle.publishedAt : null;

    return {
      productId: _productId,
      handle: _handle,
      title: _title,
      variants: _variants,
      onlineStoreUrl: _onlineStoreUrl,
      publishedAt: _publishedAt,
    };

  } catch (error) {
    console.log(" Error while getting Autograph Product! ", error);
  }
};
