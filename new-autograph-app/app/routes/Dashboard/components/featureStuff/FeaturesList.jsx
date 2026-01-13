import { BlockStack, Text } from "@shopify/polaris";

export const FeaturesList = () => {

  const featuresList = [
    "Automatically generates a Streamily Autograph product with four distinct variants.",
    "Enables selection of different variants via the Products settings page using the 'Admin App Block,' visible on the storefront.",
    "Provides the ability to add and view a Toggle Option through the 'Theme App Block,' which can be linked to a specific product.",
    "Facilitates transactions through the Payment Section with Stripe integration.",
    "Includes a Contact Support feature to provide an email address.",
  ];

  return (
    <>
      <BlockStack gap={300}>
        <Text as="h2" variant="headingLg">
          FEATURES
        </Text>
        <BlockStack gap={200}>
          {featuresList.map((feature, index) => (
            <Text key={index} as="h3" variant="headingSm" fontWeight="regular">
              {`➺`} {feature}
            </Text>
          ))}
        </BlockStack>
      </BlockStack>
    </>
  );
};
