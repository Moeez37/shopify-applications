import { useEffect, useState } from "react";
import { useFetcher, useLoaderData } from "@remix-run/react";
import {
  Page,
  Layout,
  Text,
  Card,
  Button,
  BlockStack,
  Link,
  InlineStack,
} from "@shopify/polaris";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { autographProduct } from "./Dashboard/autographProduct";
import { autographOrder } from "./Dashboard/autographOrder";
import { useAutographGlobalOrdersCost } from "../context/AutographOrdersCostProvider";
import { UsageCharges } from "./Dashboard/components/ordersStuff/UsageCharges";


export const loader = async ({ request }) => {
  await authenticate.admin(request);
  console.log("===== Dashboard loader =====");

  let AUTOGRAPH_ORDERS = null;

  const AUTOGRAPH_PRODUCT = await autographProduct(request);
  console.log("AUTOGRAPH_PRODUCT :", AUTOGRAPH_PRODUCT);

  const productId = AUTOGRAPH_PRODUCT?.productId;
  if(productId) {
    AUTOGRAPH_ORDERS = await autographOrder(request, productId);
    console.log("AUTOGRAPH_ORDERS :", AUTOGRAPH_ORDERS);
  }

  return {
    AUTOGRAPH_PRODUCT,
    AUTOGRAPH_ORDERS,
  };
};

export const action = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};


export default function Dashboard() {
  const fetcher = useFetcher();
  const shopify = useAppBridge();
  const loader = useLoaderData();
  
  const { setAutographGlobalOrdersCost } = useAutographGlobalOrdersCost();

  const [autographProductData, setAutographProductData] = useState(null);
  const [autographProductId, setAutographProductId] = useState(null);
  const [autographProductVariants, setAutographProductVariants] = useState(null);

  const [autographOrdersData, setAutographOrdersData] = useState(null);
  const [autographOrdersCount, setAutographOrdersCount] = useState(0);
  const [autographOrdersTotal, setAutographOrdersTotal] = useState(0);
  const [autographFulfilledOrders, setAutographFulfilledOrders] = useState(0);


  console.log("loader :", loader);
  // console.log("fetcher :", fetcher);
  // console.log("shopify :", shopify );

  useEffect(() => {
    if(loader) {
      // Streamily Autograph Product
      if (loader?.AUTOGRAPH_PRODUCT) {
        const loaderAutographProductData = loader.AUTOGRAPH_PRODUCT;
        if(loaderAutographProductData) {
          setAutographProductData(loaderAutographProductData);
          
          const rawProductId = loaderAutographProductData?.productId;  
          if(rawProductId) {
            const extractedProductId = rawProductId.split('/').pop();
            setAutographProductId(extractedProductId);
          };
          
          const productVARINATS = loaderAutographProductData?.variants;
          if(productVARINATS) {
            const ONLY_TITLES = productVARINATS?.map((singleNode) => {
              return singleNode.node.title;
            });
            setAutographProductVariants(ONLY_TITLES);
          };
        };
      };

      // Streamily Autograph Orders
      if (loader?.AUTOGRAPH_ORDERS) {
        const autographOrders = loader.AUTOGRAPH_ORDERS?.ordersWithAutograph;
        const autographOrderCount = loader.AUTOGRAPH_ORDERS?.autographOrdersCount;
        const autographOrderTotal = loader.AUTOGRAPH_ORDERS?.autographOrdersTotal;
        
        // console.log("autographOrders :", autographOrders);
        // console.log("autographOrderCount :", autographOrderCount);
        // console.log("autographOrderTotal :", autographOrderTotal);
        
        setAutographOrdersData(autographOrders);
        setAutographOrdersCount(autographOrderCount);
        setAutographOrdersTotal(autographOrderTotal);
        setAutographGlobalOrdersCost(autographOrderTotal);

        const fulfilledOrders = autographOrders?.filter(order => order?.node?.displayFulfillmentStatus != "UNFULFILLED" );
        if(fulfilledOrders?.length > 0) {
          setAutographFulfilledOrders(fulfilledOrders.length);
        }
      }
    }

  }, [loader]);


  const isLoading = ["loading", "submitting"].includes(fetcher.state) && fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace("gid://shopify/Product/", "");

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });


  return (
    <Page>
      <TitleBar title="Streamily Autograph Dashboard">
        <button variant="primary" onClick={generateProduct}>
          Generate a product
        </button>
      </TitleBar>

      <BlockStack gap={500}>
        <Layout>
          <Layout.Section>
            <Card>
              <BlockStack gap={500}>
                <BlockStack gap={300}>
                  <Text as="h2" variant="headingMd">
                    Streamily Autograph App 
                  </Text>
                  <Text as="h2" variant="headingMd">
                    FEATURES 
                  </Text>

                  <Text variant="bodyMd" as="p">
                    This embedded app template uses{" "}
                    <Link
                      url="https://shopify.dev/docs/apps/tools/app-bridge"
                      target="_blank"
                      removeUnderline
                    >
                      App Bridge
                    </Link>{" "}
                    interface examples like an{" "}
                    <Link url="/app/additional" removeUnderline>
                      additional page in the app nav
                    </Link>
                    , as well as an{" "}
                    <Link
                      url="https://shopify.dev/docs/api/admin-graphql"
                      target="_blank"
                      removeUnderline
                    >
                      Admin GraphQL
                    </Link>{" "}
                    mutation demo, to provide a starting point for app
                    development.
                  </Text>
                </BlockStack>
                <BlockStack gap={200}>
                  <Text as="h3" variant="headingMd">
                    Get started with products
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Generate a product with GraphQL and get the JSON output for
                    that product. Learn more about the{" "}
                    <Link
                      url="https://shopify.dev/docs/api/admin-graphql/latest/mutations/productCreate"
                      target="_blank"
                      removeUnderline
                    >
                      productCreate
                    </Link>{" "}
                    mutation in our API references.
                  </Text>
                </BlockStack>
                <InlineStack gap={300}>
                  <Button loading={isLoading} onClick={generateProduct}>
                    Generate a product
                  </Button>
                </InlineStack>
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Product Details */}
          <Layout.Section variant="oneThird">
            <BlockStack gap={500}>
              <Card background='bg-fill-hover' >
                <BlockStack gap={600}>
                  <Text as="h2" variant="headingMd">
                    Streamily Autograph Product
                  </Text>
                  {autographProductData && 
                    <BlockStack gap={200}>
                      <InlineStack align="space-between">
                        <Text as="span" variant="bodyMd">
                          Name
                        </Text>
                        <Link
                          url={`shopify:admin/products/${autographProductId}`}
                          target="_top"
                          removeUnderline
                        >
                          {autographProductData?.title} 
                        </Link>
                      </InlineStack>
                      <InlineStack align="space-between">
                        <Text as="span" variant="bodyMd">
                          Handle
                        </Text>
                        <Link
                          url={`shopify:admin/products/${autographProductId}`}
                          target="_top"
                          removeUnderline
                        >
                          {autographProductData?.handle}
                        </Link>
                      </InlineStack>

                      <InlineStack align="space-between">
                        <Text as="span" variant="bodyMd">
                          Variants
                        </Text>
                        <span>
                          <Link
                            url={`shopify:admin/products/${autographProductId}`}
                            target="_top"
                            removeUnderline
                          >
                            {autographProductData?.variants?.length || 0 }
                          </Link>
                        </span>
                      </InlineStack>

                      {autographProductVariants?.length > 0 && (
                        <ul style={{ margin: 0, paddingLeft: '1.5rem' }}>
                          {autographProductVariants.map((variant, index) => (
                            <li key={index} style={{ listStyleType: 'disc', marginLeft: '0.5rem' }}>
                              <Text as="span" variant="bodyMd">
                                {variant}
                              </Text>
                            </li>
                          ))}
                        </ul>
                      )}
                    </BlockStack>
                  }
                </BlockStack>
              </Card>
            </BlockStack>
          </Layout.Section>
          
          {/* Orders Details */}
          <Layout.Section>
            <UsageCharges autographOrdersCost={autographOrdersTotal} />

            <Card>
              <BlockStack gap={600}>

                {/* Tabs Section */}
                <InlineStack gap={500} align="start" >
                  <Button size="micro" textAlign="center" variant="tertiary"> 
                    <Text as="span" variant="headingXs">
                      Last 7 Days
                    </Text>
                  </Button>
                  <Link url="/app/payment" removeUnderline monochrome>
                    <Button size="micro" textAlign="center" fullWidth> 
                      Payment Section
                    </Button>
                  </Link>
                  <Link url="/app/additional" removeUnderline monochrome>
                    <Button size="micro" textAlign="center" fullWidth> 
                      Additionals
                    </Button>
                  </Link>
                </InlineStack>

                {/* Orders Section */}
                <InlineStack gap={800} align="start" blockAlign="center" direction={'row'}>
                  <Card>
                    <BlockStack gap={600} role="status">
                      <BlockStack gap={200}>
                        <Text as="h2" variant="headingMd">
                          Total Autograph Orders
                        </Text>
                        <Text as="span" variant="bodySm">
                          Orders with Streamily Autograph Product
                        </Text>
                      </BlockStack>
                      {autographOrdersCount > 0 ? (
                        <Text variant="heading2xl" as="legend" fontWeight="bold" numeric alignment="start">
                          {autographOrdersCount}
                        </Text>
                      ) : (
                        <Text variant="headingXl" as="legend" fontWeight="bold" numeric alignment="start">
                          0
                        </Text>
                      )}
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap={600}>
                      <BlockStack gap={200}>
                        <Text as="h2" variant="headingMd">
                          Total Autograph Orders Cost
                        </Text>
                        <Text as="span" variant="bodySm">
                          Cost of all orders with Streamily Autograph Product
                        </Text>
                      </BlockStack>
                      {autographOrdersTotal > 0 ? (
                        <Text variant="heading2xl" as="legend" fontWeight="bold" numeric alignment="end">
                          ${autographOrdersTotal.toFixed(2)}
                        </Text>
                      ) : (
                        <Text variant="headingXl" as="legend" fontWeight="bold" numeric alignment="end">
                          $0
                        </Text>
                      )}
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap={800}>
                      <BlockStack gap={200}>
                        <Text as="h2" variant="headingMd">
                          View Orders! 
                        </Text>
                        <Text as="span" variant="bodySm">
                          View Streamily Autograph orders 
                        </Text>
                      </BlockStack>
                      {autographProductId && (
                        <Button
                          url={`shopify:admin/orders?product_id=${autographProductId}`}
                          target="_top"
                          size="medium"
                          textAlign="center"
                          fullWidth
                        >
                          View Orders
                        </Button>
                      )}
                    </BlockStack>
                  </Card>
                </InlineStack>

                {/* Fullfilled Orders Section */}
                {/* <InlineStack gap="600" align="start" blockAlign="center" direction={'row'} >
                  <Card>
                    <BlockStack gap={600} role="status">
                      <BlockStack gap={200}>
                        <Text as="h2" variant="headingMd">
                          Fulfilled Orders!
                        </Text>
                        <Text as="span" variant="bodySm">
                          Orders that are fullfilled with Autographs
                        </Text>
                      </BlockStack>
                      {autographFulfilledOrders > 0 ? (
                        <InlineStack gap="800" role="status" direction="row">
                          <Text variant="heading2xl" as="legend" fontWeight="bold" numeric alignment="start">
                            {autographFulfilledOrders}
                          </Text>
                        </InlineStack>
                      ) : (
                        <Text variant="headingXl" as="legend" fontWeight="bold" numeric alignment="start">
                          0
                        </Text>
                      )}
                    </BlockStack>
                  </Card>

                  <Card>
                    <BlockStack gap={800}>
                      <BlockStack gap={200}>
                        <Text as="h2" variant="headingMd">
                          View Fulfilled Orders! 
                        </Text>
                        <Text as="span" variant="bodySm">
                          View Streamily Autograph orders 
                        </Text>
                      </BlockStack>
                      {autographProductId && (
                        <Button
                          url={`shopify:admin/orders?product_id=${autographProductId}&fulfillment_status=shipped`}
                          target="_top"
                          size="medium"
                          textAlign="center"
                          fullWidth
                        >
                          View Fulfilled Orders 
                        </Button>
                      )}
                    </BlockStack>
                  </Card>
                </InlineStack> */}

              </BlockStack>
            </Card>
          </Layout.Section>
          
        </Layout>
      </BlockStack>
    </Page>
  );
}
