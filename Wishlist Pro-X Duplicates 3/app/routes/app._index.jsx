import { authenticate } from "../shopify.server";
import { useEffect, useState } from "react";
import { useLoaderData } from "@remix-run/react";
import { useAppBridge } from "@shopify/app-bridge-react";
import {
  Page,
  Layout,
  BlockStack,
  Text,
} from "@shopify/polaris";
import { Welcome } from "./home/components/Welcome";
import { AddWishlistAppBlockCollection, AddWishlistAppBlockHeader, AddWishlistAppBlockProduct } from "./home/components/AddWishlistAppBlock";


export const loader = async ({ request }) => {
  await authenticate.admin(request);
  // const THEME_EXTENSION_ID = process.env.SHOPIFY_WISHLIST_PROX_ID;
  const THEME_EXTENSION_ID = process.env.NODE_ENV == 'production' ? process.env.SHOPIFY_WISHLIST_PROX_ID : process.env.SHOPIFY_WISHLIST_PROX_ID_DEV;
  console.log("THEME_EXTENSION_ID :", THEME_EXTENSION_ID);

  return {
    themeAppExtensionId: THEME_EXTENSION_ID,
  };
};

export const action = async ({ request }) => {
  await authenticate.admin(request);
  return null;
};


export default function Index() {
  const shopify = useAppBridge();
  const loader = useLoaderData();

  const [appBlockProductDeepLink, setAppBlockProductDeepLink] = useState(null);
  const [appBlockHeaderDeepLink, setAppBlockHeaderDeepLink] = useState(null);
  const [appEmbedCollectionDeepLink, setAppEmbedCollectionDeepLink] = useState(null);
  const [appEmbedFloatingButtonDeepLink, setAppEmbedFloatingButtonDeepLink] = useState(null);


  const { themeAppExtensionId } = loader;
  
  useEffect(() => {
    const SHOP = shopify?.config?.shop;
    if(SHOP && themeAppExtensionId) {
      const appBlockProduct = `https://${SHOP}/admin/themes/current/editor?template=product&addAppBlockId=${themeAppExtensionId}/wishlist_prox_app_block&target=mainSection`;
      setAppBlockProductDeepLink(appBlockProduct);
      
      // const appBlock_H_DeepLink = `https://${SHOP}/admin/themes/current/editor?template=product&addAppBlockId=${themeAppExtensionId}/wishlist_prox_header_icon_block&target=sectionGroup:header`;
      const appBlockHeader = `https://${SHOP}/admin/themes/current/editor?template=product`;
      setAppBlockHeaderDeepLink(appBlockHeader);
      
      const appEmbedCollection = `https://${SHOP}/admin/themes/current/editor?context=apps&template=collection&activateAppId=${themeAppExtensionId}/wishlist_prox_app_collection`;
      setAppEmbedCollectionDeepLink(appEmbedCollection);

      const appEmbedFloatingButton = `https://${SHOP}/admin/themes/current/editor?context=apps&template=collection&activateAppId=${themeAppExtensionId}/wishlist_prox_app_embed`;
      setAppEmbedFloatingButtonDeepLink(appEmbedFloatingButton);
    }
  }, [shopify, themeAppExtensionId]);
  

  return (
    <Page>
      <BlockStack gap="500">
        <Layout>
          <Layout.Section>
            <Welcome />
          </Layout.Section>

          <Layout.Section>
            <BlockStack gap={100}>
              <Text as="h3" variant="headingMd" tone="inherit">
                Manage your Setup 
              </Text>
              <AddWishlistAppBlockProduct appBlockProductDeepLink={appBlockProductDeepLink} />
              <AddWishlistAppBlockHeader appBlockHeaderDeepLink={appBlockHeaderDeepLink} appEmbedFloatingButtonDeepLink={appEmbedFloatingButtonDeepLink} />
              <AddWishlistAppBlockCollection appEmbedCollectionDeepLink={appEmbedCollectionDeepLink} />
            </BlockStack>
          </Layout.Section>

        </Layout>
      </BlockStack>
    </Page>
  );
};
