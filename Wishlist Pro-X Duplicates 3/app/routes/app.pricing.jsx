import { TitleBar } from "@shopify/app-bridge-react";
import {
  Layout,
  Page,
  InlineStack,
} from "@shopify/polaris";
import { PricingCard } from "./pricing/components/PricingCard";

export default function Pricing() {
  return (
    <Page narrowWidth>
      <TitleBar title="Pricing Plan" />
      <Layout>
        <Layout.Section>
          <InlineStack gap="600" align="center" blockAlign="start">
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
        </Layout.Section>
      </Layout>
    </Page>
  );
}
