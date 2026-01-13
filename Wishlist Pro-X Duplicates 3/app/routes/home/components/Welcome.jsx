import { BlockStack, Text } from "@shopify/polaris"

export const Welcome = () => {
  return (
    <div>
        <BlockStack gap={'050'}>
            <Text as="h3" variant="headingLg">
                Welcome to Wishlist ProX
            </Text>
            <Text as="p" variant="bodySm">
                Understand your customers' preferences and interactions to drive engagement and increase sales with powerful performance analytics.
            </Text>
        </BlockStack>
    </div>
  );
};
