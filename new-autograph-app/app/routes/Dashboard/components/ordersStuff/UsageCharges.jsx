
import { Text, Card, InlineStack, Icon, Link } from "@shopify/polaris";
import { ChevronRightIcon, OrderIcon } from "@shopify/polaris-icons";
import { useAutographGlobalOrdersCost } from "../../../../context/AutographOrdersCostProvider";

export const UsageCharges = ({autographOrdersCost}) => {
  const { autographGlobalOrdersCost } = useAutographGlobalOrdersCost();

  // console.log("autographOrdersCost 11 :", autographOrdersCost);
  // console.log("autographGlobalOrdersCost 22:", autographGlobalOrdersCost);

  const pendingCost = autographGlobalOrdersCost ? autographGlobalOrdersCost : autographOrdersCost;

  return (
    <>
      <Card background='bg-fill-info' >
        <InlineStack blockAlign='center' align='space-between'>
          <InlineStack align='center' gap='200'>
            <Icon source={OrderIcon} />
            <Text as='p' variant='headingMd'>
              ${pendingCost.toFixed(2)} USD to Fulfill
            </Text>
          </InlineStack>
          <Link url="/app/payment" removeUnderline monochrome>
            <Icon source={ChevronRightIcon} />
          </Link>
        </InlineStack>
      </Card>
    </>
  );
};
