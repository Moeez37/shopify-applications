import { publishProduct } from "./publishProduct";

export const createProduct = async (autographProductHandle) => {
    const GRAPHQL_ENDPOINT = 'shopify:admin/api/graphql.json';

    const PRODUCT_CREATION_MUTATION = `
        mutation populateProduct($input: ProductInput!) {
            productCreate(input: $input) {
              product {
                id
                title
                handle
                status
                options {
                  id
                  name
                  position
                  optionValues {
                    id
                    name
                    hasVariants
                  }
                }
              }
              userErrors {
                field
                message
              }
            }
        }
    `;

    const PRODUCT_VARIANTS_BULK_CREATION_MUTATION = `
        mutation CreateProductVariants($productId: ID!, $variantsInput: [ProductVariantsBulkInput!]!) {
            productVariantsBulkCreate(productId: $productId, variants: $variantsInput) {
                productVariants {
                    id
                    title
                    selectedOptions {
                        name
                        value
                    }
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;

    const PRODUCT_OPTION_DELETION_MUTATION = `
        mutation DeleteOptionsFromProduct($productId: ID!, $options: [ID!]!,  $strategy: ProductOptionDeleteStrategy) {
            productOptionsDelete(
                productId: $productId, 
                options: $options,
                strategy: $strategy
            ) {
                product {
                    id
                    variants(first: 250) {
                        edges {
                            node {
                            id
                            title
                            price
                            }
                        }
                    }
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;

    const PRODUCT_VARIANTS_BULK_UPDATION_MUTATION = `
        mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
            productVariantsBulkUpdate(productId: $productId, variants: $variants) {
                productVariants {
                    id
                    price
                    inventoryPolicy
                    inventoryItem {
                        id
                        tracked
                    }
                }
            }
        }
    `;

    const UPDATE_INVENTORY_ITEMS_MUTATION = `
          mutation updateInventoryTracked($id: ID!, $input: InventoryItemInput!) {
            inventoryItemUpdate(id: $id, input: $input) {
              inventoryItem {
                id
                tracked
              }
              userErrors {
                message
              }
            }
          }
    `;

// --------------------------------------------------------------------


    // product creation
    const productCreationVariable = {
        input: {
            title: 'Streamily Autograph',
            handle: "autograph-gift-wrap-handle",
            status: "ACTIVE",
            productOptions: [
                {
                    name: 'Signature',
                    values: [
                        { name: 'Christ' }, 
                        { name: 'John' },
                        { name: 'Emily' },
                        { name: 'Steven' },
                    ],
                },
                {
                    name: "Autograph-Variants",
                    values: [
                        { name: "xSmall" },
                        { name: "Small" },
                        { name: "Medium" },
                        { name: "Large" }
                    ]
                }
            ],
        },
    };

    const productCreatedResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
            query: PRODUCT_CREATION_MUTATION,
            variables: productCreationVariable
        })
    });
    const responseJson = await productCreatedResponse.json();
    const product = responseJson.data?.productCreate.product;
    // console.log("product created:", product);

    const productId = product.id;
    const productOptions = product.options;
    const productOptionsSize = productOptions[1].id;


    // variants creations
    const variantCrationVariables = {
        productId: productId,
        variantsInput: [
            // {
            //   price: 0.00,
            //   optionValues: [
            //     { name: "Christ", optionName: "Signature" },
            //     { name: "xSmall", optionName: "Autograph-Variants" }
            //   ],
            // },
            {
                price: 0.00,
                optionValues: [
                    { name: "Christ", optionName: "Signature" },
                    { name: "Small", optionName: "Autograph-Variants" }
                ],
            },
            {
                price: 0.00,
                optionValues: [
                    { name: "Christ", optionName: "Signature" },
                    { name: "Medium", optionName: "Autograph-Variants" }
                ],
            },
            {
                price: 0.00,
                optionValues: [
                    { name: "Christ", optionName: "Signature" },
                    { name: "Large", optionName: "Autograph-Variants" }
                ],
            },
            {
                price: 50.00,
                optionValues: [
                    { name: "John", optionName: "Signature" },
                    { name: "xSmall", optionName: "Autograph-Variants" }
                ],
            },
            {
                price: 50.00,
                optionValues: [
                    { name: "John", optionName: "Signature" },
                    { name: "Small", optionName: "Autograph-Variants" }
                ],
            },
            {
                price: 50.00,
                optionValues: [
                    { name: "John", optionName: "Signature" },
                    { name: "Medium", optionName: "Autograph-Variants" }
                ],
            },
            {
                price: 50.00,
                optionValues: [
                    { name: "John", optionName: "Signature" },
                    { name: "Large", optionName: "Autograph-Variants" }
                ],
            },
            {
                price: 70.00,
                optionValues: [
                    { name: "Emily", optionName: "Signature" },
                    { name: "xSmall", optionName: "Autograph-Variants" }
                ],
            },
            {
                price: 70.00,
                optionValues: [
                    { name: "Emily", optionName: "Signature" },
                    { name: "Small", optionName: "Autograph-Variants" }
                ],
            },
            {
                price: 70.00,
                optionValues: [
                    { name: "Emily", optionName: "Signature" },
                    { name: "Medium", optionName: "Autograph-Variants" }
                ],
            },
            {
                price: 70.00,
                optionValues: [
                    { name: "Emily", optionName: "Signature" },
                    { name: "Large", optionName: "Autograph-Variants" }
                ],
            },
            {
                price: 100.00,
                optionValues: [
                    { name: "Steven", optionName: "Signature" },
                    { name: "xSmall", optionName: "Autograph-Variants" }
                ],
            },
            {
                price: 100.00,
                optionValues: [
                    { name: "Steven", optionName: "Signature" },
                    { name: "Small", optionName: "Autograph-Variants" }
                ],
            },
            {
                price: 100.00,
                optionValues: [
                    { name: "Steven", optionName: "Signature" },
                    { name: "Medium", optionName: "Autograph-Variants" }
                ],
            },
            {
                price: 100.00,
                optionValues: [
                    { name: "Steven", optionName: "Signature" },
                    { name: "Large", optionName: "Autograph-Variants" }
                ],
            },
        ],
    };

    await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
            query: PRODUCT_VARIANTS_BULK_CREATION_MUTATION,
            variables: variantCrationVariables
        })
    });
    // const variantCreatedResponseJSON = await variantCreatedResponse.json();
    // console.log("variantCreatedResponseJSON :", variantCreatedResponseJSON);


    // deletion unuse variants
    const varinatDeletionVariables = {
        productId: productId,
        options: [productOptionsSize],
        strategy: "POSITION"
    };

    const deleteResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
            query: PRODUCT_OPTION_DELETION_MUTATION,
            variables: varinatDeletionVariables
        })
    });

    const deleteResponseJson = await deleteResponse.json();
    const { productOptionsDelete } = deleteResponseJson.data;
    const newProductVariants = productOptionsDelete?.product?.variants.edges;
    // console.log("newProductVariants :", newProductVariants);

    const firstVariantId = newProductVariants[0]?.node.id;
    const secondVariantId = newProductVariants[1]?.node.id;
    const thirdVariantId = newProductVariants[2]?.node.id;
    const forthVariantId = newProductVariants[3]?.node.id;

    // update variant price
    const variantUpdationVariables = {
        productId: productId,
        variants: [
            { id: firstVariantId, price: 0.00 },
            { id: secondVariantId, price: 50.00 },
            { id: thirdVariantId, price: 70.00 },
            { id: forthVariantId, price: 100.00 },
        ],
    };

    const variantResponse1 =  await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
            query: PRODUCT_VARIANTS_BULK_UPDATION_MUTATION,
            variables: variantUpdationVariables
        })
    });

    const variantResponseJson1 = await variantResponse1.json();      
    const { productVariantsBulkUpdate } = variantResponseJson1.data;
    const productVariants = productVariantsBulkUpdate?.productVariants;
    // console.log("productVariants :", productVariants);

    console.log("Creation Product OK!! ");

    // Loop through variants and update if tracked is true
    for (const variant of productVariants) {
        const inventoryItem = variant.inventoryItem;
        if (inventoryItem.tracked === true) {

            const variables = {
                id: inventoryItem.id,
                input: {
                    tracked: false
                }
            }

            await fetch(GRAPHQL_ENDPOINT, {
                method: 'POST',
                body: JSON.stringify({
                    query: UPDATE_INVENTORY_ITEMS_MUTATION,
                    variables: variables
                })
            });
            console.log('Successfully updated inventory item!');
        }
    }

    await publishProduct(productId);
}
