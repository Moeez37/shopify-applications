import { BlockStack, Text } from "@shopify/polaris";

export const InstallationMessage = () => {
    return (
        <>
            <BlockStack gap={200}>
                <Text as="h2" variant="headingLg">
                    Streamily Autograph App
                </Text>
                <Text as="h3" variant="headingMd">
                    Thank you for installing the Streamily Autographs App!
                </Text>
            </BlockStack>
        </>
    );
};
