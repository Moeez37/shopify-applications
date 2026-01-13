import { TitleBar } from "@shopify/app-bridge-react";
import {
  Page,
  Layout,
  InlineStack,
  BlockStack,
  Text,
} from "@shopify/polaris";
import { ContactSupport } from "./home/components/ContactSupport";
import { PricingCard } from "./pricing/components/PricingCard";

export default function Support() {
  return (
    <Page>
      <TitleBar title="Help & Support" />
      <Layout>
        <Layout.Section>
          <ContactSupport />
        </Layout.Section>

        {/* <Layout.Section>
          <BlockStack gap={400}>
            <Text as="h3" variant="headingLg" alignment="start">
              App Plan
            </Text>
            <InlineStack gap="600" align="start" blockAlign="start">
              <PricingCard
                featuredText="Most Popular"
                title="FREE"
                description="Perfect for stores looking to enhance customer experience with seamless wishlist management tracking."
                features={[
                  "Quick 2 Minute Setup",
                  "Unlimited Wishlists & Saved Items",
                  "Product Button Option",
                  "Wishlist on Collection Page",
                  "Dedicated Wishlist Page",
                  "24/7 Email Support",
                ]}
                price="$0"
                frequency="month"
                button={{
                  content: "Your Current Plan",
                  props: {
                    variant: "primary",
                    onClick: () => console.log("clicked plan!"),
                  },
                }}
              />
            </InlineStack>
          </BlockStack>
        </Layout.Section> */}

      </Layout>
    </Page>
  );
}
