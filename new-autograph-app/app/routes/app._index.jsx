import { useEffect, useState } from "react";
import { json } from "@remix-run/node";
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
import { createGiftWrap } from "./API/createGiftWrap";
import { publishProduct } from "./API/publishProduct";
import { autographProduct } from "./Dashboard/autographProduct";
import { autographOrder } from "./Dashboard/autographOrder";
import { useAutographGlobalOrdersCost } from "../context/AutographOrdersCostProvider";
import { useDateRangeAutograph } from "../context/AutographDateRangeProvider";
import { shopShow } from "./Payment_Methods/shopShow";
import { customerTransactions, getCustomerIdByEmail } from "./Payment_Methods/stripe.server";

import { FeaturesList } from "./Dashboard/components/featureStuff/FeaturesList";
import { InstallationMessage } from "./Dashboard/components/featureStuff/InstallationMessage";
import { ProductDetails } from "./Dashboard/components/featureStuff/ProductDetails";
import { UsageCharges } from "./Dashboard/components/ordersStuff/UsageCharges";
import { OrdersDetails } from "./Dashboard/components/ordersStuff/OrdersDetails";
import { OrdersTimeline } from "./Dashboard/components/ordersStuff/OrdersTimeline";
import { useAutographProductDataHook } from "../context/AutographProductDataProvider";


export const loader = async ({ request }) => {
  await authenticate.admin(request);
  console.log("===== Index loader =====");

  let SHOP_INFO = null;
  let CUST_TRANS = null;
  let AUTOGRAPH_PRODUCT = null;
  let AUTOGRAPH_ORDERS = null;
  let timeStampForOrders = null;
  let ianaTimezone = null;


  const shopDetails = await shopShow(request);
  if (shopDetails && shopDetails?.email) {
    // console.log("shopDetails :", shopDetails);

    SHOP_INFO = shopDetails;
    ianaTimezone = shopDetails?.ianaTimezone

    const customerDataByEmail = await getCustomerIdByEmail(shopDetails.email);
    // console.log("customerDataByEmail :", customerDataByEmail);
    if(customerDataByEmail) {
      const latestTansaction = await customerTransactions(customerDataByEmail.id);
      // console.log("latestTansaction :", latestTansaction);
      if(latestTansaction) {
        CUST_TRANS = latestTansaction;

        const transection_timestamp = latestTansaction.created;
        // console.log("transection_timestamp :", transection_timestamp);
        timeStampForOrders = transection_timestamp;
      }
    }
  }


  const autographProductRes = await autographProduct(request);
  // console.log("autographProductRes :", autographProductRes);

  // Create and Published Streamily Autograph Product if not found one
  if(!autographProductRes || autographProductRes?.length < 0) {
    console.log('Autograph Product is not available');
    
    const productResponse = await createGiftWrap(request);
    if(productResponse && productResponse?.productId) {
      console.log('Autograph Product is Created Successfully!');

      AUTOGRAPH_PRODUCT = productResponse;

      const isPublished = await publishProduct(request, productResponse.productId);
      if(isPublished) {
        console.log('Autograph Product is published Successfully!');
      }
    }
  }

  //Streamily Autograph Product found
  if(autographProductRes) {
    AUTOGRAPH_PRODUCT = autographProductRes;

    const productId = autographProductRes?.productId;
    const productHandle = autographProductRes?.handle;
    const publishedAt = autographProductRes?.publishedAt;

    // Product is not Published, Published here
    if((!publishedAt) && (productId !== null) && productHandle) {
      console.log('Streamily Autograph Product IS NOT PUBLISHED ON ONLINE STORE');
      const againPublished = await publishProduct(request, productId);
      if(againPublished){
        console.log('Streamily Autograph Product is again published Successfully.');
      }
    }

    // console.log("timeStampForOrders :", timeStampForOrders);
    // Get Streamily Autograph Product Orders
    if(productId) {
      AUTOGRAPH_ORDERS = await autographOrder(request, productId, timeStampForOrders, ianaTimezone);
    }
  }

  // console.log("SHOP_INFO :", SHOP_INFO);
  // console.log("CUST_TRANS :", CUST_TRANS);
  // console.log("AUTOGRAPH_PRODUCT :", AUTOGRAPH_PRODUCT);
  // console.log("AUTOGRAPH_ORDERS :", AUTOGRAPH_ORDERS);
  
  return {
    SHOP_INFO,
    CUST_TRANS,
    AUTOGRAPH_PRODUCT,
    AUTOGRAPH_ORDERS,
  };
};


export const action = async ({ request }) => {
  const { admin } = await authenticate.admin(request);
  console.log("===== Index action =====");
  
  const color = ["Red", "Orange", "Yellow", "Green"][
    Math.floor(Math.random() * 4)
  ];
  const response = await admin.graphql(
    `#graphql
      mutation populateProduct($product: ProductCreateInput!) {
        productCreate(product: $product) {
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
        product: {
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
  console.log('%c     STREAMILY AUTOGRAPHS APP     ', 'font-size:16px; color: white; background: linear-gradient(90deg, #8da5e0, #88c9b8, #b2dfd4); padding: 4px; border-radius: 4px;');

  const loader = useLoaderData()
  const fetcher = useFetcher();
  const shopify = useAppBridge();

  const { autographProductDataGlobally, setAutographProductDataGlobally } = useAutographProductDataHook();
  const { setAutographGlobalOrdersCost } = useAutographGlobalOrdersCost();
  const { setTimeStampContext } = useDateRangeAutograph();

  const [shopInfo, setShopInfo] = useState(null);
  const [shopCustomerTransec, setShopCustomerTransec] = useState(null);

  const [autographProductData, setAutographProductData] = useState(null);
  const [autographProductId, setAutographProductId] = useState(null);
  const [autographProductVariants, setAutographProductVariants] = useState(null);

  const [autographOrdersData, setAutographOrdersData] = useState(null);
  const [autographOrdersCount, setAutographOrdersCount] = useState(0);
  const [autographOrdersTotal, setAutographOrdersTotal] = useState(0);
  const [autographFulfilledOrders, setAutographFulfilledOrders] = useState(0);



  // console.log("autographProductDataGlobally 11:", autographProductDataGlobally);
  // console.log("loader:", loader);
  // console.log("fetcher :", fetcher);
  // console.log("shopify :", shopify );
  
  useEffect(() => {
    if (loader) {

      // Shop Details
      if(loader?.SHOP_INFO) {
        // console.log("loader?.SHOP_INFO :", loader?.SHOP_INFO);
        setShopInfo(loader?.SHOP_INFO);
      }

      // shop as a customer transection
      if(loader?.CUST_TRANS) {
        // console.log("loader?.CUST_TRANS :", loader?.CUST_TRANS);
        const customTransec = loader.CUST_TRANS;
        setShopCustomerTransec(customTransec);
        const transection_timestamp = customTransec?.created;
        if(transection_timestamp) {
          // console.log("transection_timestamp :", transection_timestamp);
          setTimeStampContext(transection_timestamp);
        }
      }

      // Streamily Autograph Product
      if (loader?.AUTOGRAPH_PRODUCT) {
        const loaderAutographProductData = loader.AUTOGRAPH_PRODUCT;
        if (loaderAutographProductData) {
          setAutographProductData(loaderAutographProductData);

          const rawProductId = loaderAutographProductData?.productId;
          if (rawProductId) {
            const extractedProductId = rawProductId.split('/').pop();
            setAutographProductId(extractedProductId);
          };

          const productVARINATS = loaderAutographProductData?.variants;
          if (productVARINATS) {
            // console.log("productVARINATS :", productVARINATS);
            const TITLES_WITH_PRIZES = productVARINATS?.map((singleNode) => {
              return {
                title: singleNode.node.title,
                prize: singleNode.node.price,
              };
            });
            setAutographProductVariants(TITLES_WITH_PRIZES);
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

        const fulfilledOrders = autographOrders?.filter(order => order?.node?.displayFulfillmentStatus != "UNFULFILLED");
        if (fulfilledOrders && fulfilledOrders?.length > 0) {
          setAutographFulfilledOrders(fulfilledOrders.length);
        }
      }
    }
  }, [loader]);



  const isLoading = ["loading", "submitting"].includes(fetcher.state) && fetcher.formMethod === "POST";
  const productId = fetcher.data?.product?.id.replace("gid://shopify/Product/","");

  useEffect(() => {
    if (productId) {
      shopify.toast.show("Product created");
    }
  }, [productId, shopify]);
  const generateProduct = () => fetcher.submit({}, { method: "POST" });


  return (
    <Page>
      <TitleBar title="Streamily Autograph Dashboard">
        <button variant="primary" onClick={generateProduct} disabled>
          Generate a product
        </button>
      </TitleBar>

      <BlockStack gap={600}>
        <Layout>
          {/* Installtion Message and Feature List */}
          <Layout.Section>
            <Card>
              <BlockStack gap={500}>
                <BlockStack gap={800}>
                  <InstallationMessage />
                  <FeaturesList />
                </BlockStack>
                {/* <BlockStack gap={200}>
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
                </InlineStack> */}
              </BlockStack>
            </Card>
          </Layout.Section>

          {/* Product Details */}
          <Layout.Section variant="oneThird">
            <ProductDetails 
              autographProductId={autographProductId} 
              autographProductData={autographProductData} 
              autographProductVariants={autographProductVariants} 
            />
          </Layout.Section>

          {/* Orders Details */}
          <Layout.Section>
            <UsageCharges autographOrdersCost={autographOrdersTotal} />
            <OrdersDetails 
              autographOrdersCount={autographOrdersCount}
              autographOrdersTotal={autographOrdersTotal} 
              autographProductId={autographProductId} 
            />
          </Layout.Section>


          {/* <Layout.Section>
            <OrdersTimeline autographOrdersCost={autographOrdersTotal} />
          </Layout.Section> */}
        </Layout>
      </BlockStack>
    </Page>
  );
}
