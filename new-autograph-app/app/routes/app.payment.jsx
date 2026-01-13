import { Banner, BlockStack, Layout, Page, Spinner, Text } from "@shopify/polaris";
import { useEffect, useState } from "react";
import { Outlet, useFetcher, useLoaderData } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";
import { ActionCard } from "./Payment_Methods/components/ActionCard";
import CompletePage from "./Payment_Methods/components/CompletePage";
import CheckoutForm from "./Payment_Methods/components/CheckoutForm";
import {
  createPaymentIntent,
  createCheckoutSession,
  getCustomerIdByEmail,
  createTestCustomer,
} from "./Payment_Methods/stripe.server";
import { useAutographGlobalOrdersCost } from "../context/AutographOrdersCostProvider";
import { PendingPaymentCard } from "./Payment_Methods/components/PendingPaymentCard";
import { LOCAL_APP_HANDLE, PRODUCTION_APP_HANDLE } from "./API/constants";
import { authenticate } from "../shopify.server";
import { shopShow } from "./Payment_Methods/shopShow";
import { CustomerRecord } from "./Payment_Methods/components/CustomerRecord";

// Make sure to call loadStrip method outside of a component’s render to avoid recreating the Stripe 
// object on every render. // This is your test publishable API key.
// const stripePromise = loadStripe("pk_test_51QWiSr2KryqPNa1kwCOcBcqfeRaspKVCV5Dbxm0MTyBcHuZzvis434t2tUzY1NL4PtWGkv2HPB7GEhrjZySLvWcG00TOzaYBoB");

export const loader = async ({ request }) => {
  console.log("===== Payment loader =====");
  await authenticate.admin(request);

  const shopDetails = await shopShow(request);
  // console.log("payment loader - shopDetails :", shopDetails);

  // const customUserEmail = 'api-develop@gmail.com';
  let customersData = null;

  if(shopDetails?.email) {
    const CustomerDataByEmail = await getCustomerIdByEmail(shopDetails.email);
    // console.log("CustomerDataByEmail :", CustomerDataByEmail);

    // If customer is not present then create new one by using shop email and name
    if(!CustomerDataByEmail && !CustomerDataByEmail?.id) {
      const createdCustomer = await createTestCustomer(shopDetails.email, shopDetails?.name);
      // console.log("createdCustomer :", createdCustomer);
      customersData = createdCustomer;
    } else {
      customersData = CustomerDataByEmail;
    }
  }
  // console.log("payment loader - customersData :", customersData);

   
  const APPhANDLE = process.env.NODE_ENV === 'production' ? PRODUCTION_APP_HANDLE : LOCAL_APP_HANDLE;
  console.log("payment loader - APPhANDLE :", APPhANDLE);
  
  // const STRIPE_PUBLISHABLE_KEY = process.env.NODE_ENV === "production" ? process.env.STRIPE_PUBLISHABLE_KEY_LIVE : process.env.STRIPE_PUBLISHABLE_KEY_TEST;
  const STRIPE_PUBLISHABLE_KEY = process.env.NODE_ENV === "production" ? process.env.STRIPE_PUBLISHABLE_KEY_TEST : process.env.STRIPE_PUBLISHABLE_KEY_TEST;
  console.log("payment loader - STRIPE_PUBLISHABLE_KEY :", STRIPE_PUBLISHABLE_KEY);


  return {
    shopDetails,
    customersData,
    APPhANDLE,
    STRIPE_PUBLISHABLE_KEY,
  };
};


export const action = async ({ request }) => {
  console.log("===== Payment action =====");

  const formData = await request.formData();
  // console.log("Payment action - formData :", formData);
  const { orderCostToPay, custStripeId, receipEmail, mitaData, cardNumber, expiryDate, cvv, cardholderName } = Object.fromEntries(formData.entries());
  // console.log("Payment action - Card Details", { cardNumber, expiryDate, cvv, cardholderName });
  // console.log("Payment action - orderCostToPay :", orderCostToPay);
  // console.log("Payment action - custStripeId :", custStripeId);
  // console.log("Payment action - receipEmail :", receipEmail);
  // console.log("Payment action - metaData :", mitaData);

  if(cardNumber && expiryDate && cvv && cardholderName) {
    await createCheckoutSession(request);
  }

  let clientPaymentIntentData = null;
  if(orderCostToPay) {
    // const customUserEmail = 'api-develop@gmail.com';
    clientPaymentIntentData = await createPaymentIntent(orderCostToPay, custStripeId, receipEmail, mitaData);
  }
  // console.log("Payment action - clientPaymentIntentData :", clientPaymentIntentData);

  return {
    clientPaymentIntentData,
  };
};


export default function Payment() {
  const loader = useLoaderData();
  const shopify = useAppBridge();
  const fetcher = useFetcher();
  const { autographGlobalOrdersCost } = useAutographGlobalOrdersCost();

  const [shopDomain, setShopDomain] = useState(null); 
  const [appHandle, setAppHandle] = useState(null); 

  const [clientSecret, setClientSecret] = useState(null);
  const [dpmCheckerLink, setDpmCheckerLink] = useState(null);

  const [ordersCost, setOrdersCost] = useState(null);
  const [billingAddress, setBillingAddress] = useState(null);
  const [receiptEmail, setReceiptEmail] = useState(null);

  const [customerStripeRecord, setCustomerStripeRecord] = useState(null);
  const [customerStripeId, setCustomerStripeId] = useState(null);

  const [displayPaymentMethod, setDisplayPaymentMethod] = useState(false);
  const [confirmed, setConfirmed] = useState(false);
  const [isLoading, setIsLoading] = useState(false);


  // console.log("autographGlobalOrdersCost11 :", autographGlobalOrdersCost);
  const orderCostToHandle = (autographGlobalOrdersCost && autographGlobalOrdersCost > 0) ? (autographGlobalOrdersCost * 100) : 0;

  useEffect(() => {
    // console.log("loader :", loader);
    // console.log("shopify :", shopify);
    // console.log("fetcher :", fetcher);

    // loader Use cases
    if (loader) {
      if(loader?.shopDetails) {
        // console.log("shopDetails :", loader.shopDetails);
        const { id, name, email, myshopifyDomain } = loader.shopDetails;
        setBillingAddress(loader.shopDetails);
        setReceiptEmail(email);
      }

      if(loader?.APPhANDLE) {
        setAppHandle(loader.APPhANDLE);
      }

      if(loader?.customersData) {
        const customers_Data = loader.customersData;
        setCustomerStripeRecord(customers_Data);
        setCustomerStripeId(customers_Data?.id);
      }
    }

    // shopify object use cases
    if(shopify) {
      const shop = shopify?.config?.shop;
      if(shop) {
        const shopName = shop.replace(".myshopify.com", "");
        setShopDomain(shopName);
      }
    }

    // fetcher use cases
    if(fetcher) {
      if (fetcher?.data?.clientPaymentIntentData) {
        const clientPaymentIntentData = fetcher.data.clientPaymentIntentData;
        // console.log("clientPaymentIntentData :", clientPaymentIntentData);

        setClientSecret(clientPaymentIntentData?.clientSecret);
        // [DEV] For demo purposes only
        setDpmCheckerLink(clientPaymentIntentData?.dpmCheckerLink);
      }
    }

    if (orderCostToHandle) {
      setOrdersCost(orderCostToHandle);
    }

  }, [shopify, loader, fetcher, orderCostToHandle]);


  useEffect(() => {
    // console.log("confirmed :", confirmed);
    const queryParams = new URLSearchParams(window.location.search);
    const clientSecretInParams = queryParams.get("payment_intent_client_secret");
    if(clientSecretInParams) {
      // console.log("clientSecretInParams :", clientSecretInParams);
      setClientSecret(clientSecretInParams);
      setConfirmed(true);
    }
  }, []);
  

  const handlePaymentMethodAdding = () => {
    // console.log("handlePaymentMethodAdding selected");
    // console.log("ordersCost :", ordersCost);
    // console.log("customerStripeId :", customerStripeId);
    // console.log("receiptEmail :", receiptEmail);
    // console.log("billingAddress :", billingAddress);

    const metaDataObject = { 
      'shopId': billingAddress?.id, 
      'shopName': billingAddress?.name, 
      'shopEmail': billingAddress?.email, 
      'myshopifyDomain': billingAddress?.myshopifyDomain
    };
    // console.log("metaDataObject :", metaDataObject);

    setIsLoading(true);

    fetcher.submit({
      orderCostToPay: ordersCost, 
      custStripeId: customerStripeId, 
      receipEmail: receiptEmail, 
      mitaData: JSON.stringify(metaDataObject),
    }, { method: "POST" });

    setTimeout(() => {
      console.log("Set Time out after 2 Seconds");
      setIsLoading(false);
      setDisplayPaymentMethod(true);
    }, 2000);
  };


  const stripePromise = loadStripe(loader.STRIPE_PUBLISHABLE_KEY);

  const appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#0d6ec9",
    },
  };

  const stripeOptions = {
    clientSecret,
    appearance,
  };

  return (
    <Page title="Streamily Payments">
      <Layout>
        <Layout.Section>
          <BlockStack gap={100}>
            {displayPaymentMethod || confirmed ? (
              <BlockStack gap={200}>
                {clientSecret && (
                  <Elements stripe={stripePromise} options={stripeOptions}>
                    <Outlet /> {/* Outlet - Renders the matching child route of a parent route. */}
                    {confirmed ? (
                      <CompletePage shopDomain={shopDomain} appHandle={appHandle} />
                    ) : (
                      <>
                        <Banner
                          title="Payment Charges"
                          tone="info"
                          onDismiss={() => {
                            setDisplayPaymentMethod(false);
                          }}
                        >
                          <Text as="h2" variant="headingLg">
                            ${(ordersCost/100).toFixed(2)} will be charged!
                          </Text>
                        </Banner>
                        <CheckoutForm dpmCheckerLink={dpmCheckerLink} shopDomain={shopDomain} appHandle={appHandle} billingAddress={billingAddress} />
                      </>
                    )}
                  </Elements>
                )}
              </BlockStack>
            ) : (
              <>
                <div style={{ position: "relative" }}>
                  {isLoading && (
                    <div style={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      zIndex: 10,
                    }}>
                      <Spinner size="small" />
                    </div>
                  )}

                  <BlockStack gap={100}>
                    <PendingPaymentCard ordersCostHere={ordersCost} paymentSelectionhandler={handlePaymentMethodAdding}/>
                    <ActionCard ordersCostHere={ordersCost} paymentSelectionhandler={handlePaymentMethodAdding} />
                    <CustomerRecord customerSRecord={customerStripeRecord} receiptEmail={receiptEmail}/>
                  </BlockStack>
                </div>
              </>
            )}
          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}
