import prismaDb from "../db.server";
import { cors } from "remix-utils/cors";
import { json } from "@remix-run/node";

// Laoder used to handle 'GET' request
export const loader = async ({ request }) => {
    console.log("WWW WWW API WISHLIST - LOADER");

    const url = new URL(request.url);
    const shop = url.searchParams.get('shop');
    const productId = url.searchParams.get('productId');
    // console.log('shop :', shop);
    // console.log('productId :', productId);

    if(!productId || !shop) {
        const missingResponse = json({
            method: "GET",
            message: "Missing Data. Required data: productId, shop",
        }, { status: 500 });
        return cors(request, missingResponse);
    }

    try {
        const wishlist = await prismaDb.wishlistData.findMany({
            where: { 
                shop: shop,
                productId: productId 
            },
        });
        console.log("wishlist :", wishlist);

        const response = json({
            success: true,
            message: 'Success',
            data: wishlist,
        });
        
        return cors(request, response);
    } catch (error) {
        console.error("Error getting wishlist data:", error);
        const errorResponse = json({
            message: 'Failed to get product data from wishlist',
            method: "GET",
            error: error.message,
        }, { status: 500 });
        return cors(request, errorResponse);
    }
};


// Action used to handle 'Post', 'Patch', 'Put' & 'Delete' requests
export const action = async ({ request }) => {
    console.log("WWW WWW API WISHLIST - ACTION");

    const formData = await request.formData();
    console.log("formData :", formData);

    const { shop, productId, _action, shareableWishlistID, wishlistItems } = Object.fromEntries(formData.entries());

    if (_action == 'SHAREBALE_WISHLIST_POST' && shareableWishlistID && wishlistItems) {
        // console.log("wishlistItems :", wishlistItems);
        try {
            const wishlistItemsJson = JSON.stringify(wishlistItems);
            const wishlist = await prismaDb.shareableWishlistData.upsert({
                where: { shareableWishlistId: shareableWishlistID },
                update: {
                    withlistItems: wishlistItemsJson, 
                    shop: shop,
                    updatedAt: new Date(), 
                },
                create: {
                    shareableWishlistId: shareableWishlistID, 
                    withlistItems: wishlistItemsJson, 
                    shop: shop,
                },
            });

            const response = json({
                message: 'Shareable wishlist Saved',
                method: _action,
                wishlist: wishlist,
            });

            // console.log("response :", response);
            return cors(request, response);

        } catch (error) {
            console.error("Error while saving shareable wishlist:", error);
            const errorResponse = json({
                message: 'Failed to save shareable whishlist',
                method: _action,
                error: error.message,
            }, { status: 500 });
            return cors(request, errorResponse);
        }

    } else if(_action == 'SHAREBALE_WISHLIST_GET' && shareableWishlistID) {
        try {
            const wishlist = await prismaDb.shareableWishlistData.findMany({
                where: { shareableWishlistId: shareableWishlistID }
            });            
            const wishlistItems = wishlist?.[0]?.withlistItems;            
            const wishlistItemsParsed = JSON.parse(wishlistItems);
            const response = json({ success: true, withlistItems: wishlistItemsParsed });
            return cors(request, response);
        } catch (error) {
            console.error("Error while getting shareable wishlist:", error);
            const errorResponse = json({
                success: false,
                error: error.message,
            }, { status: 500 });
            return cors(request, errorResponse);
        }
        
    } else if(_action == 'TRENDING_WISHLIST_GET') {
        console.log("TRENDING_WISHLIST_GET TRENDING_WISHLIST_GET");
        try {
            const response = await admin.graphql(
                `#graphql
                query productTitle {
                  products(first: 1) {
                    nodes {
                      title
                    }
                  }
                }`,
            );
            const body = await response.json();
            const title = body.data.products.nodes[0].title;
    
            return liquid(
                `<section style="background: teal; color: white; padding: 5rem; text-align: center;">
                  {% if customer %}
                    <p>Customer: {{ customer.first_name }}</p>
                    <p>Favorite products: ${title}</p>
                  {% else %}
                    <p>Please sign in</p>
                  {% endif %}
                </section>
                `,
            );
        } catch (error) {
            console.error("Error getting wishlist data:", error);
            return liquid(
                `<section style="background: teal; color: white; padding: 5rem; text-align: center;">
                    <p> No Item Found! </p>
                </section>
                `,
            );
        }
    }


    if(!productId || !shop || !_action) {
        return {
            message: "Missing Data. Required data: productId, shop",
            method: _action,
        }
    }

    switch (_action) {
        case "CREATE": 
            try {
                const wishlist = await prismaDb.wishlistData.upsert({
                    where: { productId: productId },
                    update: {
                        add_wl_count: { increment: 1 },
                        updatedAt: new Date(),
                    },
                    create: {
                        productId,
                        shop,
                        add_wl_count: 1,
                    },
                });
    
                const response = json({
                    message: 'Product added to wishlist',
                    method: _action,
                    wishlist: wishlist,
                });
                
                // console.log("response :", response);
                return cors(request, response);

            } catch (error) {
                console.error("Error adding AddCount to wishlist:", error);
                const errorResponse = json({
                    message: 'Failed to add product to wishlist',
                    method: _action,
                    error: error.message,
                }, { status: 500 });

                return cors(request, errorResponse);
            }
            
        case "REMOVE":
            try {
                const wishlist = await prismaDb.wishlistData.upsert({
                    where: { productId: productId },
                    update: {
                        remove_wl_count: { increment: 1 },
                        updatedAt: new Date(),
                    },
                    create: {
                        productId,
                        shop,
                        remove_wl_count: 1,
                    },
                });
        
                const response = json({
                    message: 'Product removed from wishlist',
                    method: _action,
                    wishlist: wishlist,
                });
                    
                // console.log("response :", response);
                return cors(request, response);

            } catch (error) {
                console.error("Error adding RemoveCount to wishlist:", error);
                const errorResponse = json({
                    message: 'Failed to remove product to wishlist',
                    method: _action,
                    error: error.message,
                }, { status: 500 });

                return cors(request, errorResponse);
            }

        case "ADD_TO_CART":
            try {
                const wishlist = await prismaDb.wishlistData.upsert({
                    where: { productId: productId },
                    update: {
                        add_to_cart: { increment: 1 },
                        updatedAt: new Date(),
                    },
                    create: {
                        productId,
                        shop,
                        add_to_cart: 1,
                    },
                });
        
                const response = json({
                    message: 'Product Add to Cart from wishlist',
                    method: _action,
                    wishlist: wishlist,
                });
                    
                // console.log("response :", response);
                return cors(request, response);

            } catch (error) {
                console.error("Error adding product to cart from wishlist:", error);
                const errorResponse = json({
                    message: 'Failed to add product to cart from whishlist',
                    method: _action,
                    error: error.message,
                }, { status: 500 });

                return cors(request, errorResponse);
            }

        default:
            return new Response("Method Not Allowed", { status: 405 });
    }
};
