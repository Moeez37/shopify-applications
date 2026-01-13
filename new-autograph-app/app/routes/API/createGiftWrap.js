import { authenticate } from '../../shopify.server';

export const createGiftWrap = async ( request ) => {
    console.log("Creating Streamily Autograph Product... ");

    const { admin } = await authenticate.admin(request);

    const productCreatedResponse = await admin.graphql(
        `#graphql
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
          }`,
        {
          variables: {
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
          },
        },
      );
      const responseJson = await productCreatedResponse.json();
      const product = responseJson.data.productCreate.product;
      // console.log("product created:", product);
      const productId = product.id;
      const productOptions = product.options;
      const productOptionsSize = productOptions[1].id;

      await admin.graphql(
        `#graphql
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
        }`,
        {
          variables: {
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
                  { name: "Emily",  optionName: "Signature" },
                  { name: "xSmall", optionName: "Autograph-Variants" }
                ],
              },
              {
                price: 70.00,
                optionValues: [
                  { name: "Emily",  optionName: "Signature" },
                  { name: "Small", optionName: "Autograph-Variants" }
                ],
              },
              {
                price: 70.00,
                optionValues: [
                  { name: "Emily",  optionName: "Signature" },
                  { name: "Medium", optionName: "Autograph-Variants" }
                ],
              },
              {
                price: 70.00,
                optionValues: [
                  { name: "Emily",  optionName: "Signature" },
                  { name: "Large", optionName: "Autograph-Variants" }
                ],
              },
              {
                price: 100.00,
                optionValues: [
                  { name: "Steven",  optionName: "Signature" },
                  { name: "xSmall", optionName: "Autograph-Variants" }
                ],
              },
              {
                price: 100.00,
                optionValues: [
                  { name: "Steven",  optionName: "Signature" },
                  { name: "Small", optionName: "Autograph-Variants" }
                ],
              },
              {
                price: 100.00,
                optionValues: [
                  { name: "Steven",  optionName: "Signature" },
                  { name: "Medium", optionName: "Autograph-Variants" }
                ],
              },
              {
                price: 100.00,
                optionValues: [
                  { name: "Steven",  optionName: "Signature" },
                  { name: "Large", optionName: "Autograph-Variants" }
                ],
              },
            ],
          },
        },
      );


      const deleteResponse = await admin.graphql(
        `#graphql
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
        }`,
        {
          variables: {
            productId: productId,
            options: [productOptionsSize],
            strategy: "POSITION"
          },
        },
      );
      
      const deleteResponseJson = await deleteResponse.json();      
      const { productOptionsDelete } = deleteResponseJson.data;
      const newProductVariants = productOptionsDelete.product.variants.edges;
      // console.log("newProductVariants :", newProductVariants);

      const firstVariantId = newProductVariants[0]?.node.id;
      const secondVariantId = newProductVariants[1]?.node.id;
      const thirdVariantId = newProductVariants[2]?.node.id;
      const forthVariantId = newProductVariants[3]?.node.id;

      const variantResponse1 = await admin.graphql(
        `#graphql
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
        }`,
        {
          variables: {
            productId: productId,
            variants: [
              { id: firstVariantId, price: 0.00 },
              { id: secondVariantId, price: 50.00 },
              { id: thirdVariantId, price: 70.00 },
              { id: forthVariantId, price: 100.00 },
            ],
          },
        },
      );
      const variantResponseJson1 = await variantResponse1.json();      
      const { productVariantsBulkUpdate } = variantResponseJson1.data;
      const productVariants = productVariantsBulkUpdate.productVariants;
      // console.log("productVariants :", productVariants);

      // Loop through variants and update if tracked is true
      for (const variant of productVariants) {
        const inventoryItem = variant.inventoryItem;
        if (inventoryItem.tracked === true) {
          try {
            const updateInventoryItemsResponse = await admin.graphql(
              `#graphql
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
              `,
              {
                variables: {
                  id: inventoryItem.id,
                  input: {
                    tracked: false
                  }
                }
              }
            );

            const updateInventoryItems = await updateInventoryItemsResponse.json(); 
            if (updateInventoryItems?.data?.inventoryItemUpdate?.userErrors?.length > 0) {
              console.error('Error updating inventory item');
            } else {
              console.log('Successfully updated inventory item');
            }
          } catch (error) {
            console.error('GraphQL request failed', error);
          }
        }
      }

      return {
        'productVariants': productVariants,
        'productId': productId,
      };
}
