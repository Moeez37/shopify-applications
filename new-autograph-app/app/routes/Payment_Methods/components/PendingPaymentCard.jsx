import { Card, Text, InlineStack, Icon, Button } from '@shopify/polaris';
import { ChevronRightIcon, OrderIcon } from '@shopify/polaris-icons';

export const PendingPaymentCard = ({ordersCostHere, paymentSelectionhandler}) => {
  // console.log("ordersCostHere :", ordersCostHere);
  const isButtonDisabled = ordersCostHere === null || ordersCostHere === 0;

  const handleManualPaymentMethod = () => {
    // console.log("handleManualPaymentMethod Clicked ");
    paymentSelectionhandler();
  };


  return (
    <>
      <Card background='bg-fill-active'>
        <InlineStack blockAlign='center' align='space-between'>
          <InlineStack align='center' gap='200'>
            <Icon source={OrderIcon} />
            {isButtonDisabled ? (
              <Text as='p' variant='headingMd'>
                No need to pay
              </Text>
            ) : (
              <Text as='p' variant='headingMd'>
                ${(ordersCostHere / 100).toFixed(2)} USD payment to fulfill
              </Text>
            )}
          </InlineStack>
          <div>
            <Button
              variant='plain'
              onClick={() => handleManualPaymentMethod()}
              disabled={isButtonDisabled}
              >
              <Icon source={ChevronRightIcon} />
            </Button>
          </div>
        </InlineStack>
      </Card>
    </>
  );
};
