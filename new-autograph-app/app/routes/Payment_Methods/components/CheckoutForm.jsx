import { useEffect, useState } from "react";
import { Form } from "@remix-run/react";
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js";
import { BlockStack, Button, Card, InlineStack, Spinner, Text } from "@shopify/polaris";

export default function CheckoutForm({ dpmCheckerLink, shopDomain, appHandle, billingAddress }) {
  const stripe = useStripe();
  const elements = useElements();

  const [isPaymentElementReady, setIsPaymentElementReady] = useState(false);
  const [isStripeLoaded, setIsStripeLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [returnedURL, setReturnedURL] = useState('');

  // Check if Stripe and Element are loaded
  useEffect(() => {
    // console.log("stripe :", stripe);
    // console.log("elements :", elements);
    if (stripe && elements) {
      setIsStripeLoaded(true);
    }
  }, [stripe, elements]);

  useEffect(() => {
    if (shopDomain && appHandle) {
      const url = `https://admin.shopify.com/store/${shopDomain}/apps/${appHandle}/app/payment/`;
      setReturnedURL(url);
    }
  }, [shopDomain, appHandle]);


  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!stripe || !elements) {
      return; // Stripe.js hasn't yet loaded. // Make sure to disable form submission until Stripe.js has loaded.
    }
    setIsLoading(true);

    try {
      const { error } = await stripe.confirmPayment({
        elements,
        confirmParams: {
          return_url: returnedURL, // Redirect to the payment completion page.
          payment_method_data: {
            allow_redisplay: 'always',
          }
        },
      });

      // This point will only be reached if there is an immediate error when confirming the payment. 
      // Otherwise, your customer will be redirected to your `return_url`. For some payment methods 
      // like iDEAL, your customer will be redirected to an intermediate site first to authorize the 
      // payment, then redirected to the `return_url`.
      if (error) {
        setMessage(error.type === "card_error" || error.type === "validation_error" ? error.message : "An unexpected error occurred.");
      }
    } catch (err) {
      setMessage("An unexpected error occurred.");
    } finally {
      setIsLoading(false);
    }
  };


  // console.log("billingAddress :", billingAddress);
  // console.log("billingAddress?.name :", billingAddress?.name);
  // console.log("billingAddress?.email :", billingAddress?.email);
  // console.log("billingAddress?.phone :", billingAddress?.billingAddress.phone);

  // Layout = 'tabs' | 'accordion' | 'auto';
  const paymentElementOptions = {
    layout: "accordion",
    defaultValues: {
      billingDetails: {
        name: billingAddress?.name,
        email: billingAddress?.email,
        phone: billingAddress?.billingAddress?.phone,
        address: {
          line1: billingAddress?.billingAddress?.address1,
          line2: billingAddress?.billingAddress?.address2,
          city: billingAddress?.billingAddress?.city,
          country: billingAddress?.billingAddress?.country,
          postal_code: billingAddress?.billingAddress?.zip,
        },
      },
    },
    fields: {
      billingDetails: {
        name: "auto",
        email: "auto", 
        phone: "auto",
        address: "if_required",
      },
    }    
  };

  return (
    <>
      <Form onSubmit={handleSubmit}>
        <Card>
          <BlockStack gap={500}>
            <Text as="h3" variant="headingMd" tone="success" fontWeight="semibold" >
              Please Enter Card Details!
            </Text>

            {/* Payement Element from Stripe */}
            <PaymentElement 
              id="payment-element" 
              options={paymentElementOptions} 
              onReady={() => {
                console.log('PAYMENT ELEMENT ONREADY CALLED');
                setIsPaymentElementReady(true);
              }}
              onLoadError={(event) => {
                console.error("Load error:", event.error.message);
              }}
              // onLoaderStart={(event) => {
              //   console.log("Loader has started", event);
              // }}
              // onChange={(event) => {
              //   console.log('Input changed:', event);
              // }}
              // onEscape={() => {
              //   console.log('Escape key pressed');
              // }}
              // onFocus={() => {
              //   console.log('PaymentElement is focused');
              // }}
              // onBlur={() => {
              //   console.log('PaymentElement lost focus');
              // }}
            />

            <InlineStack blockAlign="center">
              <Button
                id="submit"
                submit
                loading={isLoading}
                disabled={isLoading || !isStripeLoaded || !isPaymentElementReady}
                fullWidth
                size="large"
                variant="primary"
              >
                {isLoading ? (
                  <Spinner size="small" />
                ) : (
                  "Pay with Card"
                )}
              </Button>
            </InlineStack>
          </BlockStack>

          {message && <div id="payment-message">{message}</div>}
        </Card>
      </Form>

      {/* [DEV] : For demo purposes only, display dynamic payment methods annotation and integration checker */}
      <div id="dpm-annotation">
        <p>
          [DEV] Purpose only! Payment methods are dynamically displayed based on customer location,
          order amount, and currency.&nbsp;
          <a
            href={dpmCheckerLink}
            target="_blank"
            rel="noopener noreferrer"
            id="dpm-integration-checker"
          >
            Preview payment methods by transaction
          </a>
        </p>
      </div>

    </>
  );
}
