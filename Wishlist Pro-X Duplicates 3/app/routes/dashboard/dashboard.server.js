import prismaDb from "../../db.server";

// Function to get Wishlist Data from DB using SHOP
export const shopWishlistData = async (shop) => {
    console.log("Getting Shop Wishlist Data...");
    // console.log("shop :", shop);

    try {
        const wishlist = await prismaDb.wishlistData.findMany({
            where: { shop: shop },
        });
        // console.log("wishlist :", wishlist);

        const sharedWishlists = await prismaDb.shareableWishlistData.count({
            where: { shop: shop },
        });
        // console.log("sharedWishlists :", sharedWishlists);

        return {
            success: true,
            data: wishlist,
            sharedWishlists: sharedWishlists,
        }
    } catch (error) {
        console.error("Error while getting Shop Wishlist Data:", error);
        return {
            success: false,
            data: [],
        }
    }
};
// ----------------------------------------------------------

// GraphQL PRODUCT Query
const PRODUCT_QUERY = `#graphql
    query getProductsByIds($ids: [ID!]!) {
        nodes(ids: $ids) {
            ... on Product {
                id
                title
                handle
                status
                tags
                totalInventory
                images(first: 1) {
                    edges {
                        node {
                            url
                        }
                    }
                }
            }
        }
    }
`;

// Function to Shop fetch Products using their IDs
export const fetchProductUsingIds = async (admin, wishlistData) => {
    console.log("Getting Shop Products Using Ids...");
    // console.log("wishlistData :", wishlistData);

    const productIds = wishlistData.filter(singleObj => singleObj?.productId && !isNaN(singleObj.productId)).map(singleObj => `gid://shopify/Product/${singleObj.productId}`);
    // console.log("productIds :", productIds);

    // Return early if no valid product IDs exist
    if (productIds.length === 0) {
        console.log("No valid product IDs found.");
        return [];
    }

    try {
        const response = await admin.graphql(PRODUCT_QUERY, {variables: { ids: productIds }} );        
        if (!response.ok) {
            throw new Error(`GraphQL Error: ${responseData.errors?.[0]?.message || "Unknown error"}`);
        }

        const responseData = await response.json();
        const productMap = new Map();
        responseData?.data?.nodes?.forEach(product => {
            // console.log("product :", product);
            if(product?.id) {
                const productId = product.id.split('/').pop();
                // console.log("productId :", productId);

                productMap.set(productId, {
                    id: product.id,
                    title: product.title,
                    handle: product.handle,
                    tags: product.tags,
                    totalInventory: product.totalInventory,
                    image: product.images.edges[0]?.node.url || null,
                    status: product.status,
                });
            }
        });
        // console.log("productMap :", productMap);

        // Merge product data into wishlistData
        const updatedWishlistData = wishlistData.map(item => ({
            ...item,
            productData: productMap.get(item.productId) || null,
        }));
        // console.log("Updated Wishlist Data:", updatedWishlistData);
        
        return updatedWishlistData;
    } catch (error) {
        console.error("Error fetching products:", error);
        return [];
    }
};
// ----------------------------------------------------------


