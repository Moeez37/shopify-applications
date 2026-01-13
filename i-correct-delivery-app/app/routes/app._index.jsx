import { useState, useEffect } from "react";
import { json } from "@remix-run/node";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Box,
  List,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate, } from "../shopify.server";
import { validateStuartAccessToken } from "./api/stuart_authentication/validateStuartAccessToken";
import { productCounts } from "./api/productCounts";
// import { productCreation } from "./api/productCreation";
// import { getJobPricing } from "./api/jobs_and_deliveries/getJobPricing";
// import { getAllWebhooks } from "./api/webhooks/getAllWebhooks";
// import { createWebhook } from "./api/webhooks/createWebhook";

export const loader = async ({ request }) => {
  await authenticate.admin(request);

  const totalProducts = await productCounts(request);
  
  const accessToken = await validateStuartAccessToken(request);
  
  if (accessToken) {
    // console.log('loader - accessToken:', accessToken);

    // const createNewWebhook = await createWebhook(accessToken);
    // console.log('loader - createNewWebhook:', createNewWebhook);

    // const allWebhooks = await getAllWebhooks(accessToken);
    // console.log('loader - allWebhooks:', allWebhooks)

    // const jobPricing = await getJobPricing(accessToken);
    // console.log('loader - jobPricing:', jobPricing)
    
    //  await productCreation(request);
  }


  return json({ 
    totalProducts: totalProducts,
  });
};

export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
            status
            variants(first: 10) {
              edges {
                node {
                  id
                  price
                  barcode
                  createdAt
                }
              }
            }
          }
        }
      }`,
    {
      variables: {
        input: {
          title: `${color} Snowboard`,
        },
      },
    },
  );
  const responseJson = await response.json();
  const product = responseJson.data.productCreate.product;
  const variantId = product.variants.edges[0].node.id;
  const variantResponse = await admin.graphql(
    `#graphql
    mutation shopifyRemixTemplateUpdateVariant($productId: ID!, $variants: [ProductVariantsBulkInput!]!) {
      productVariantsBulkUpdate(productId: $productId, variants: $variants) {
        productVariants {
          id
          price
          barcode
          createdAt
        }
      }
    }`,
    {
      variables: {
        productId: product.id,
        variants: [{ id: variantId, price: "100.00" }],
      },
    },
  );
  const variantResponseJson = await variantResponse.json();

  return json({
    product: responseJson.data.productCreate.product,
    variant: variantResponseJson.data.productVariantsBulkUpdate.productVariants,
  });
};

export default function Index() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const loaderData = useLoaderData();

  const [totalCount, setTotalCount] = useState(0);

  const { totalProducts } = loaderData;

  





  useEffect(()=>{
    setTotalCount(totalProducts);
  }, [totalProducts]);



  const isLoading =
    ["loading", "submitting"].includes(fetcher.state) &&
    fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace(
    "gid://shopify/Product/",
    "",
  );

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });




  return (
    <Page>
      <TitleBar title="iCorrect Delivery App">
        <button variant="primary" onClick={generateProduct}>
          Generate a product
        </button>
      </TitleBar>

      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap="500">
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    iCorrect Delivery Shopify App Installed Successfully 🎉
                  </Text>
                </BlockStack>
                
                <BlockStack gap="300">
                  <Text as="h3" variant="headingMd">
                    Handle Products
                  </Text>
                  <InlineStack gap="300">
                    <Button loading={isLoading} onClick={generateProduct}>
                      Generate a product
                    </Button>
                    {fetcher.data?.product && (
                      <Button
                        url={`shopify:admin/products/${productId}`}
                        target="_blank"
                        variant="plain"
                      >
                        View product
                      </Button>
                    )}
                  </InlineStack>
                </BlockStack>

                <Card roundedAbove="md" background="bg-surface-secondary" >
                  <Text as="h2" variant="headingMd">
                    Total Products: {totalCount}
                  </Text>
                </Card>

              </BlockStack>
            </Card>
          </Layout.Section>


          <Layout.Section variant="oneThird">
            <BlockStack gap="500">
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    App template specs
                  </Text>
                  <BlockStack gap="200">
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Framework
                      </Text>
                      <Link
                        url="https://remix.run"
                        target="_blank"
                        removeUnderline
                      >
                        Remix
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Database
                      </Text>
                      <Link
                        url="https://www.prisma.io/"
                        target="_blank"
                        removeUnderline
                      >
                        Prisma
                      </Link>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        Interface
                      </Text>
                      <span>
                        <Link
                          url="https://polaris.shopify.com"
                          target="_blank"
                          removeUnderline
                        >
                          Polaris
                        </Link>
                        {", "}
                        <Link
                          url="https://shopify.dev/docs/apps/tools/app-bridge"
                          target="_blank"
                          removeUnderline
                        >
                          App Bridge
                        </Link>
                      </span>
                    </InlineStack>
                    <InlineStack align="space-between">
                      <Text as="span" variant="bodyMd">
                        API
                      </Text>
                      <Link
                        url="https://shopify.dev/docs/api/admin-graphql"
                        target="_blank"
                        removeUnderline
                      >
                        GraphQL API
                      </Link>
                    </InlineStack>
                  </BlockStack>
                </BlockStack>
              </Card>
              <Card>
                <BlockStack gap="200">
                  <Text as="h2" variant="headingMd">
                    Next steps
                  </Text>
                  <List>
                    <List.Item>
                      Build an{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/getting-started/build-app-example"
                        target="_blank"
                        removeUnderline
                      >
                        {" "}
                        example app
                      </Link>{" "}
                      to get started
                    </List.Item>
                    <List.Item>
                      Explore Shopify’s API with{" "}
                      <Link
                        url="https://shopify.dev/docs/apps/tools/graphiql-admin-api"
                        target="_blank"
                        removeUnderline
                      >
                        GraphiQL
                      </Link>
                    </List.Item>
                  </List>
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
          
        </Layout>
      </BlockStack>
    </Page>
  );
}
