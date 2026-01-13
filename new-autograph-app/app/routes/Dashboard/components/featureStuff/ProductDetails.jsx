import { BlockStack, Card, InlineStack, Link, Text } from "@shopify/polaris";

export const ProductDetails = ({
  autographProductId,
  autographProductData,
  autographProductVariants,
}) => {
  // console.log("autographProductId :", autographProductId);
  // console.log("autographProductData :", autographProductData);

  console.log("autographProductVariants :", autographProductVariants);

  return (
    <>
      <BlockStack gap={500}>
        <Card background="bg-fill-hover">
          <BlockStack gap={600}>
            <Text as="h2" variant="headingMd">
              Streamily Autograph Product Detail
            </Text>

            {autographProductData && (
              <BlockStack gap={200}>
                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd" fontWeight="medium">
                    Name
                  </Text>
                  <Link
                    url={`shopify:admin/products/${autographProductId}`}
                    target="_top"
                    removeUnderline
                  >
                    {autographProductData?.title}
                  </Link>
                </InlineStack>

                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd" fontWeight="medium">
                    Handle
                  </Text>
                    {autographProductData?.handle}
                </InlineStack>

                <InlineStack align="space-between">
                  <Text as="span" variant="bodyMd" fontWeight="medium">
                    Variants
                  </Text>
                  <span>
                    {autographProductData?.variants?.length || 0}
                  </span>
                </InlineStack>

                {autographProductVariants?.length > 0 && (
                  <ul style={{ margin: 0, paddingLeft: "1.5rem" }}>
                    {autographProductVariants.map((variant, index) => (
                      <li
                        key={index}
                        style={{ listStyleType: "disc", marginLeft: "0.5rem" }}
                      >
                        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                          <Text as="span" variant="bodyMd" fontWeight="medium">
                            {variant.title}
                          </Text>
                          
                          <Text as="span" variant="bodyMd" fontWeight="medium">
                            ${variant.prize}
                          </Text>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </BlockStack>
            )}
          </BlockStack>
        </Card>
      </BlockStack>
    </>
  );
};
