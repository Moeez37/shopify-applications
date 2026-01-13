import { useEffect, useState } from "react";
import { useStripe } from "@stripe/react-stripe-js";
import { Banner, BlockStack, Box, Card, Icon, Image, InlineStack, Link, Text } from "@shopify/polaris";
import { CircleChevronLeftIcon, OrderIcon } from "@shopify/polaris-icons";

const STATUS_CONTENT_MAP2 = {
  succeeded: {
    text: "Payment Succeeded",
    status: "success",
  },
  processing: {
    text: "Your Payment is Processing.",
    status: "info",
  },
  requires_payment_method: {
    text: "Your Payment was not Successful, Please try again.",
    status: "critical",
  },
  requires_action: {
    text: "Your Payment was not completed, Please try again if you want to pay.",
    status: "critical",
  },
  default: {
    text: "Something went wrong, Please try again.",
    status: "warning",
  },
};

export default function CompletePage({shopDomain, appHandle}) {
  const stripe = useStripe();

  const [responseStatus, setResponseStatus] = useState("default");
  const [intentId, setIntentId] = useState(null);
  const [paidAmount, setPaidAmount] = useState(null);
  const [paidCurrency, setPaidCurrency] = useState(null);
  const [paidAt, setPaidAt] = useState('');
  const [receiptEmail, setReceiptEmail] = useState('');
  const [qrCodeUrl, setQrCodeUrl] = useState(null);
  const [qrCodeExpiresAt, setQrCodeExpiresAt] = useState(null);
  const [hostedInstructionsUrl, setHostedInstructionsUrl] = useState(null);

  // console.log("CompletePage - shopDomain :", shopDomain);
  // console.log("CompletePage - appHandle :", appHandle);

  useEffect(() => {
    // console.log("CompletePage - stripe :", stripe);
    if (!stripe) return;

    const clientSecret = new URLSearchParams(window.location.search).get("payment_intent_client_secret");
    if (!clientSecret) return;

    stripe.retrievePaymentIntent(clientSecret).then(({ paymentIntent }) => {
      if (!paymentIntent) return;
      // console.log("paymentIntent after payment result:", paymentIntent);
      
      const timestamp = paymentIntent.created; // Unix timestamp in seconds
      const date = new Date(timestamp * 1000); // Convert to milliseconds
      const readableDate = date.toLocaleString();
      setPaidAt(readableDate);

      setResponseStatus(paymentIntent.status);
      setIntentId(paymentIntent.id);
      setPaidAmount(paymentIntent.amount);
      setPaidCurrency(paymentIntent.currency);
      setReceiptEmail(paymentIntent.receipt_email);

      // Check for requires_action and extract QR code and URL if available
      if (paymentIntent.status === "requires_action" && paymentIntent?.next_action?.cashapp_handle_redirect_or_display_qr_code) {
        const qrcodeImageurlPNG = paymentIntent.next_action.cashapp_handle_redirect_or_display_qr_code?.qr_code?.image_url_png;
        const qrcodeImageurlSVG = paymentIntent.next_action.cashapp_handle_redirect_or_display_qr_code?.qr_code?.image_url_svg;
        const expiresAtTimestamp = paymentIntent.next_action.cashapp_handle_redirect_or_display_qr_code?.qr_code?.expires_at;
        const hostelInstructionUrl = paymentIntent.next_action.cashapp_handle_redirect_or_display_qr_code?.hosted_instructions_url;

        if(qrcodeImageurlPNG) {
          setQrCodeUrl(qrcodeImageurlPNG);
        } else {
          setQrCodeUrl(qrcodeImageurlSVG);
        }

        if(hostelInstructionUrl) {
          setHostedInstructionsUrl(hostelInstructionUrl);
        }
        
        if (expiresAtTimestamp) {
          const expiresDate = new Date(expiresAtTimestamp * 1000);
          setQrCodeExpiresAt(expiresDate.toLocaleString());
        }
      }
    });
  }, [stripe]);



  return (
    <BlockStack gap={300}>
      {responseStatus === 'succeeded' && (
        <BlockStack gap={0}>

          <Card background='bg-fill-info'>
            <InlineStack blockAlign='center' align='space-between'>
              <InlineStack align='center' gap='200'>
                <Icon source={OrderIcon} />
                <Text as='h2' variant='headingMd'>
                  Thanks for your payment!
                </Text>
              </InlineStack>
              <Link 
                url={`https://admin.shopify.com/store/${shopDomain}/apps/${appHandle}/app/payment`}
                target="_top"
                removeUnderline 
                monochrome
              >
                <InlineStack align='center' gap='100'>
                  <Text alignment="center">Go Back</Text>
                  <Icon source={CircleChevronLeftIcon} accessibilityLabel="Go Back" />
                </InlineStack>
              </Link>
            </InlineStack>
          </Card>
        </BlockStack>
      )}

      <Card>
        <BlockStack gap={800}>
          <BlockStack gap={100}>
            <Banner
              title={`${STATUS_CONTENT_MAP2[responseStatus]?.text}`}
              tone={`${STATUS_CONTENT_MAP2[responseStatus]?.status}`}
            />
            {intentId && (
              <>
                <Card>
                  <BlockStack gap={300}>
                    <Text as="h3" variant="headingMd">
                      Payment Details:
                    </Text>

                    <InlineStack gap={200} direction={'column'} as="ul" align="start" blockAlign="start" >
                      <InlineStack gap="400">
                        <Box paddingInlineStart="200" width="120px" >
                          <Text as="span" variant="headingSm" fontWeight="regular">
                            <strong>Status:</strong>
                          </Text>
                        </Box>
                        <Box paddingInlineEnd="400">
                          <Text as="span" variant="headingSm" fontWeight="regular">
                            {responseStatus?.toUpperCase()}
                          </Text>
                        </Box>
                      </InlineStack>

                      <InlineStack gap="400">
                        <Box paddingInlineStart="200" width="120px" >
                          <Text as="span" variant="headingSm" fontWeight="regular">
                            <strong>Amount:</strong>
                          </Text>
                        </Box>
                        <Box paddingInlineEnd="400">
                          <Text as="span" variant="headingSm" fontWeight="regular">
                            ${(paidAmount / 100).toFixed(2)}
                          </Text>
                        </Box>
                      </InlineStack>

                      <InlineStack gap="400">
                        <Box paddingInlineStart="200" width="120px" >
                          <Text as="span" variant="headingSm" fontWeight="regular">
                            <strong>Currency:</strong>
                          </Text>
                        </Box>
                        <Box paddingInlineEnd="400">
                          <Text as="span" variant="headingSm" fontWeight="regular">
                            {paidCurrency.toUpperCase()}
                          </Text>
                        </Box>
                      </InlineStack>

                      <InlineStack gap="400">
                        <Box paddingInlineStart="200" width="120px" >
                          <Text as="span" variant="headingSm" fontWeight="regular">
                            <strong>Creation Time:</strong>
                          </Text>
                        </Box>
                        <Box paddingInlineEnd="400">
                          <Text as="span" variant="headingSm" fontWeight="regular">
                            {paidAt}
                          </Text>
                        </Box>
                      </InlineStack>

                      <InlineStack gap="400">
                        <Box paddingInlineStart="200" width="120px" >
                          <Text as="span" variant="headingSm" fontWeight="regular">
                            <strong>Receipt Email:</strong>
                          </Text>
                        </Box>
                        <Box paddingInlineEnd="400">
                          <Text as="span" variant="headingSm" fontWeight="regular">
                            {receiptEmail.toUpperCase()}
                          </Text>
                        </Box>
                      </InlineStack>

                      <InlineStack gap="400">
                        <Box paddingInlineStart="200" width="120px" >
                          <Text as="span" variant="headingSm" fontWeight="regular">
                            <strong>ID:</strong>
                          </Text>
                        </Box>
                        <Box paddingInlineEnd="400">
                          <Text as="span" variant="headingSm" fontWeight="regular">
                            {intentId}
                          </Text>
                        </Box>
                      </InlineStack>

                    </InlineStack>

                    {/* <Link
                    // [DEV] 
                    url={`https://dashboard.stripe.com/payments/${intentId}`}
                    target="_blank"
                    >
                    View details
                    </Link> */}
                  </BlockStack>
                </Card>
              </>
            )}

            {responseStatus === "requires_action" && (
              <BlockStack>
                {qrCodeUrl && (
                  <InlineStack gap={300} align="center">
                    <Box>
                      <Image source={qrCodeUrl} alt="QR Code for Payment" />
                    </Box>
                  </InlineStack>
                )}
                {qrCodeExpiresAt && (
                  <Box paddingBlockStart="200">
                    <Text as="p" variant="bodyMd">
                      <strong>QR Code Expires At:</strong> {qrCodeExpiresAt}
                    </Text>
                  </Box>
                )}
                {hostedInstructionsUrl && (
                  <Box paddingBlockStart="200">
                    <Text as="p" variant="bodyMd">
                      If you still got an error <strong> <Link url={hostedInstructionsUrl}>Scan New QR</Link> </strong>
                    </Text>
                  </Box>
                )}
              </BlockStack>
            )}
          </BlockStack>

          <Text as="h2" variant="headingMd">
            We appreciate your business! If you have any questions, please email{" "}
            <a href="mailto:support@streamily.com" target="_parent">
              support@streamily.com
            </a>
          </Text>

          {/* [DEV] */}
          <InlineStack>
            <Link
              url={`https://admin.shopify.com/store/${shopDomain}/apps/${appHandle}/app/payment`}
              target="_top"
              removeUnderline
            >
              Test Another [DEV]
            </Link>
          </InlineStack>

        </BlockStack>
      </Card>
    </BlockStack>
  );
}
