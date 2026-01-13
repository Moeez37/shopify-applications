import {
    Banner,
    BlockStack,
    Button,
    Card,
    InlineStack,
    Text,
  } from "@shopify/polaris";
  
  export const SupportNotice = () => {
    return (
      <>
        <Card>
          <BlockStack gap={500}>
            <Banner tone="critical">
              <Text as="h3" variant="headingMd" alignment="center" >
                Need help?
              </Text>
            </Banner>
  
            <BlockStack gap={200}>
              <Text as="h3" variant="bodyLg">
                If you have an any question about Streamily Autographs, We're always happy to help.
                Feel free to email us at {''} 
                <a href="mailto:support@streamily.com" target="_blank" rel="noopener noreferrer">
                  support@streamily.com
                </a>.
              </Text>
              <InlineStack gap={300} direction={"row"} align="start" blockAlign="center" >
                <a href="mailto:support@streamily.com" target="_blank" rel="noopener noreferrer">
                  <Button tone="critical" size="large"> Contact Us </Button>
                </a>
              </InlineStack>
            </BlockStack>
          </BlockStack>
        </Card>
      </>
    );
  };
  