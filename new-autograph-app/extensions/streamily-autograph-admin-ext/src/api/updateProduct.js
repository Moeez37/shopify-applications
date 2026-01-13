
export const updateProduct = async (productData) => {
    const GRAPHQL_ENDPOINT = 'shopify:admin/api/graphql.json';

    // Define the target prices for each variant
    const targetPrices = {
        'Christ': "0.00",  
        'John': "50.00",  
        'Emily': "70.00", 
        'Steven': "100.00",
    };
    
    // Prepare an array for the variants that need to be updated
    const variantsToUpdate = [];

    const productVariants = productData.variants.edges;
    productVariants.forEach(node => {
        const variantTitle = node.node.title;
        const currentPrice = node.node.price;
        const targetPrice = targetPrices[variantTitle];

        if (targetPrice && currentPrice !== targetPrice) {
            variantsToUpdate.push({
                id: node.node.id, 
                price: targetPrice 
            });
        }
    });

    // If there are variants to update, perform the mutation
    if (variantsToUpdate?.length > 0) {
        const mutation = `
            mutation UpdateProductVariantsOptionValuesInBulk($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
                productVariantsBulkUpdate(productId: $productId, variants: $variants) {
                    productVariants {
                        id
                        title
                    }
                    userErrors {
                        field
                        message
                    }
                }
            }
        `;

        const variables = {
            productId: productData.id,
            variants: variantsToUpdate
        };


        try {
            await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify({
                    query: mutation,
                    variables: variables
                })
            });
            console.log("Updation Product OK! ");
        } catch (error) {
            console.error("Error updating product variants:", error);
        }
    // } else {
    //     console.log("No variants need updating.");
    }

}