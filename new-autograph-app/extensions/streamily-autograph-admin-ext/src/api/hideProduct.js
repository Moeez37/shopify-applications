
export const hideProduct = async (productData) => {
    
    const GRAPHQL_ENDPOINT = 'shopify:admin/api/graphql.json';

    const HIDE_PRODUCT_MUTATION = `
        mutation updateProductMetafields($input: ProductInput!) {
            productUpdate(input: $input) {
                product {
                    id
                    handle  
                    metafields(first: 5) {
                        edges {
                            node {
                                id
                                namespace
                                key
                                value
                            }
                        }
                    }
                }
                userErrors {
                    message
                    field
                }
            }
        }
    `;

    const METAFIELD_QUERY = `
        query GetProductMetafield($id: ID!) {
            product(id: $id) {
                metafield(namespace: "seo", key: "hidden") {
                    id
                    key 
                    value
                    namespace
                }
            }
        }
    `;

    const autographProductId = productData.id;

    const response = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
            query: METAFIELD_QUERY,
            variables: { id: autographProductId }
        })
    });

    const result = await response.json();
    const metafield = result.data.product.metafield;
    // console.log('seo metafield:', metafield);

    if(!metafield || metafield.value == 0) {

        const metafieldVariables = {
            input: {
                id: autographProductId,
                metafields: [
                    {
                        namespace: "seo",
                        key: "hidden",
                        value: "1",
                        type: "number_integer",
                    }
                ]
            }
        };

        try {
            const updatedResponse = await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify({
                    query: HIDE_PRODUCT_MUTATION,
                    variables: metafieldVariables
                })
            });

            const updatedResult = await updatedResponse.json();
            if(updatedResult){
                console.log("SEO Optimization is OK! ");
            }

        } catch (error) {
            console.error("Error hiding product", error);
        }
    // } else {
    //     console.log("Already SEO Optimized")
    }

}