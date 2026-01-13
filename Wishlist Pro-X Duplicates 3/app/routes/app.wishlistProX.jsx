import { authenticate } from "../shopify.server";
import prismaDb from "../db.server";

export const loader = async ({ request }) => {
  console.log("APP PROXY WISHLIST - LOADER ");
  await authenticate.public.appProxy(request);
  console.log("1111111111111111");
  return null;
};

export async function action({ request }) {
  console.log("===> APP PROXY WISHLIST - ACTION ");
  const { admin, liquid } = await authenticate.public.appProxy(request);

  const url = new URL(request.url);
  const shop = url.searchParams.get('shop');

  const formData = await request.formData();
  // console.log("formData zzzzz:", formData);

  const {_action } = Object.fromEntries(formData.entries());


  if (_action == "TRENDING_WISHLIST_GET") {
    console.log("TTTTT TRENDING_WISHLIST_GET");

    try {
      const wishlist = await prismaDb.wishlistData.findMany({
        where: { shop: shop },
        orderBy: {add_wl_count: 'desc'},
        take: 5,
      });
      // console.log("wishlist :", wishlist);
     
      if(!wishlist || wishlist.length <= 0) {
        throw new Error("No items found in the wishlist");
      }

      const productIds = wishlist.map(item => `gid://shopify/Product/${item.productId}`);
      // console.log("Product IDs:", productIds);

      const response = await admin.graphql(`#graphql
        query getProducts($ids: [ID!]!) {
          nodes(ids: $ids) {
            ... on Product {
              id
              title
              handle
              variants(first: 1) {
                edges {
                  node {
                    id
                    price
                    inventoryQuantity
                    image {
                      altText
                      url
                    }
                  }
                }
              }
              media(first: 1, query: "media_type=IMAGE") {
                nodes {
                  preview { 
                    image { 
                      altText
                      url
                    }
                  }
                }
              }
            }
          }
        }`,
        { variables: { ids: productIds } }
      );
    
      const productResponse = await response.json();
      // console.log("productResponse :", productResponse);
      
      if (!productResponse || !productResponse?.data || !productResponse.data?.nodes || productResponse.data.nodes.length === 0) {
        throw new Error("No Wishlist Items found!");
      }

      const productData = productResponse.data.nodes;
      // console.log("Product Data:", productData);

      let productHtml = productData
        .map(product => {
          if (!product) return ""; // Handle null products
          // console.log("product :", product);

          let productImage = null;
          if (product?.variants?.edges?.length > 0 && product.variants.edges[0].node.image) {
            productImage = product.variants.edges[0].node.image;
          }
        
          // If no image found in variants, try to get from media
          if (!productImage && product.media.nodes.length > 0 && product.media.nodes[0].preview.image) {
            productImage = product.media.nodes[0].preview.image;
          }
        
          // If still no image, set a fallback
          if (!productImage) {
            productImage = { altText: 'No image available', url: '' };
          }
          // console.log('Product Image URL:', productImage.url);
          // console.log('Product Image AltText:', productImage.altText);

          const variant = product.variants.edges[0]?.node;
          // console.log("variant :", variant);

          const variantId = variant?.id?.replace('gid://shopify/ProductVariant/', '');
          // console.log("variantId :", variantId);

          return`
            <div class="wishlist-prox-widget-item">
              <div>
                <a href="/products/${product.handle}">
                  <img src="${productImage.url}" alt="${variant?.image?.altText || product.title}" style="max-width: 100px; border-radius: 5px;">
                </a>
              </div>
              
              <div class="wishlist-prox-widget-item-content">
                <h2>${product.title}</h2>
                <p>Product Price: $${variant?.price || "N/A"}</p>
                <p>Available Quantity: ${variant?.inventoryQuantity || "N/A"}</p>
                <button class="wishlistProX-addToCart-Btn" data-product-id="${product.id}" data-variant-id="${variantId}">Add to Cart</button>
              </div>
            </div>
          `;
        }).join("");
      // console.log("productHtml :", productHtml);
      
      return liquid(
        // `<div class="wishlist-prox-widget" style="background: teal; color: white; padding: 2rem; border-radius: 8px;">
        `<div class="wishlist-prox-widget">
          <h3>Trending Wishlist Items</h3>
          <div id="wishlist-prox-widget-items">${productHtml}</div>
        </div>`, 
        { layout: false },
      );

    } catch (error) {
      console.error("Error getting trending wishlist data:", error);
      return liquid(
        `<div class="wishlist-prox-widget">
          <h3>Trending Wishlist Items</h3>
          <p>${error.message || 'No Item Found!'}</p>
        </div>`,
        { layout: false },
      );
    }
  }
  
  return null;
};
