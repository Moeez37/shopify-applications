import { Banner, BlockStack, Button, InlineStack, Text } from "@shopify/polaris";

export const ContactSupport = () => {
  return (
    <>
      <Banner
        title="Need Help"
        tone="info"
      >
        <BlockStack gap={300}>
          <Text as="h3" variant="headingSm" fontWeight="regular">
            If you have an any question about out app, We're always happy to help.
          </Text>

          <InlineStack>
            <a href="mailto:support@encyphers.com" target="_blank" rel="noopener noreferrer">
              <Button variant="secondary" size="medium"> support@encyphers.com </Button>
            </a>
          </InlineStack>
        </BlockStack>
      </Banner>
    </>
  );
};
