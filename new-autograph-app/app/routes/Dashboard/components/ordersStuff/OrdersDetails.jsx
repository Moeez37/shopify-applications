import { BlockStack, Button, Card, InlineStack, Link, Text,  } from "@shopify/polaris";
import { useState } from "react";
import { DataPickerRangeShow } from "./DataPickerRangeShow";

export const OrdersDetails = ({autographOrdersCount, autographOrdersTotal, autographProductId }) => {
  const [isDatePickerVisible, setDatePickerVisible] = useState(false);
  
  // console.log("autographOrdersCount 11 :", autographOrdersCount);
  // console.log("autographOrdersTotal 11 :", autographOrdersTotal);
  // console.log("autographProductId 11 :", autographProductId);

  const handleDatePickerFunction = () => {
    setDatePickerVisible((prevState) => !prevState);
  }

  return (
    <>
      <Card>
        <BlockStack gap={600}>
        
          {/* Tabs Section */}
          <InlineStack gap={500} align="start">
            {isDatePickerVisible && <DataPickerRangeShow />}

            <Button size="micro" textAlign="center" onClick={handleDatePickerFunction} >
              <Text as="span" variant="headingXs">
                Last 7 Days
              </Text>
            </Button>

            <InlineStack gap={400}>
              {TabLinks.map((link, index) => (
                <Link key={index} url={link.url} removeUnderline monochrome>
                  <Button size="micro" textAlign="center" fullWidth>
                    {link.label}
                  </Button>
                </Link>
              ))}
            </InlineStack>
          </InlineStack>

          {/* Orders Section */}
          <InlineStack gap={800} align="start" blockAlign="center" direction={"row"}>
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

                <Text
                  variant={autographOrdersCount > 0 ? "heading2xl" : "headingXl"}
                  as="legend"
                  fontWeight="bold"
                  alignment="start"
                  numeric
                >
                  {autographOrdersCount || 0}
                </Text>
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
                <Text
                  variant={autographOrdersTotal > 0 ? "heading2xl" : "headingXl"}
                  as="legend"
                  fontWeight="bold"
                  alignment="start"
                  numeric 
                >
                  ${autographOrdersTotal > 0 ? autographOrdersTotal.toFixed(2) : "0"}
                </Text>
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
                    disabled={autographOrdersCount > 0 ? false : true}
                  >
                    {autographOrdersCount > 0 ? "View Orders" : "No Orders Found"}
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
    </>
  );
};

const TabLinks = [
  { url: "/app", label: "Home" },
  { url: "/app/setup", label: "Setup Section" },
  { url: "/app/payment", label: "Payment Section" },
  { url: "/app/support", label: "Support Section" },
  { url: "/app/additional", label: "Additionals" },
];
