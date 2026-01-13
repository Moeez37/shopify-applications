import { useState } from "react";
import { Card, BlockStack, Text, Button, ActionList, Popover, Banner } from "@shopify/polaris";

export const ActionCard = ({ordersCostHere, paymentSelectionhandler}) => {
  const [active, setActive] = useState(false);

  // console.log("ordersCostHere :", ordersCostHere);
  const isButtonDisabled = ordersCostHere === null || ordersCostHere === 0;

  const handleManualPaymentMethod = () => {
    // console.log("handleManualPaymentMethod Clicked ");
    paymentSelectionhandler();
  };

  return (
    <>
      <Banner 
        title="Please select a Pyament method"
        tone="info"
      >
        <BlockStack gap="400" align="start">
          <BlockStack gap="200">
            <Text as="h2" variant="headingMd">
              Payment Methods
            </Text>

            <Text as="p" variant="bodyMd" tone="subdued">
              Payments made for the Streamily Autographs App require you to select a payment method 
              first, such as the Credit Card method. You will only be charged the order amount displayed 
              above.
            </Text>
          </BlockStack>

          <Popover
            active={active}
            activator={
              <Button 
                onClick={() => setActive((prev) => !prev)} 
                disclosure='down' 
                size="large" 
                variant="primary"
                disabled={isButtonDisabled}
              >
                Select Payment Method
              </Button>
            }
            autofocusTarget="first-node"
            onClose={() => setActive((prev) => !prev)}
            fullWidth
            fullHeight
            fluidContent
          >
            <ActionList
              actionRole="menuitem"
              items={[
                {
                  content: "Pay using Credit Card",
                  onAction: handleManualPaymentMethod,
                },
                {
                  content: "Strip Payment Method",
                  onAction: handleManualPaymentMethod,
                },
                // {
                //   content: "Bank Deposit",
                //   onAction: () => null,
                // },
              ]}
            />
          </Popover>
          
        </BlockStack>
      </Banner>
    </>
  );
};
