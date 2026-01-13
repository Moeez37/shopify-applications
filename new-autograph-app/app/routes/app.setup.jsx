import { useEffect, useState } from "react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import { json } from "@remix-run/node";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import {
  Layout,
  Page,
  Text,
  BlockStack,
  Banner,
  InlineStack,
  Button,
  Card,
} from "@shopify/polaris";
import { SetupGuide } from "./Setup_Guide/components/SetupGuide";
import { getThemes, metafieldProducts } from "./Setup_Guide/setup.server";
import AddAdminAppBlock from "../Assets/AddAdminAppBlock.png"
import AddedAdminAppBlockYes from "../Assets/AddedAdminAppBlockYes.png"
import AddThemeAppBlock from "../Assets/AddThemeAppBlock.png"
import AddThemeAppBlockYes from "../Assets/AddThemeAppBlockYes.png"


export const loader = async ({ request }) => {
  await authenticate.admin(request);

  const productWithMetafield = await metafieldProducts(request);
  // console.log("Product Data", productWithMetafield);

  const ThemeAndAssets = await getThemes(request);
  // console.log("ThemeAndAssets:", ThemeAndAssets);

  const THEME_EXTENSION_ID = process.env.SHOPIFY_NEW_AUTOGRAPH_THEME_EXTENSION_ID;
    // process.env.NODE_ENV == "production"
      // ? process.env.SHOPIFY_STREAMILY_AUTOGRAPHS_THEME_EXT_ID
      // : process.env.SHOPIFY_STREAMILY_AUTOGRAPHS_THEME_EXT_ID_DEV;
  // console.log("THEME_EXTENSION_ID :", THEME_EXTENSION_ID);


  return json({
    productWithMetafield: productWithMetafield,
    ThemeAndAssets: ThemeAndAssets,
    themeAppExtensionId: THEME_EXTENSION_ID,
  });
};


export default function Setup() {
  const shopify = useAppBridge();
  const loaderData = useLoaderData();

  const [streamilyProductID, setStreamilyProductID] = useState(null);
  const [streamilyMetafieldExist, setStreamilyMetafieldExist] = useState(false);
  const [streamilyThemeBlockExist, setStreamilyThemeBlockExist] = useState(false);
  const [themeId, setThemeId] = useState(null);
  const [appBlockDeepLink, setAppBlockDeepLink] = useState(null);

  const [items, setItems] = useState(ITEMS);
  const [showGuide, setShowGuide] = useState(true);


  // console.log("loaderData :", loaderData);
  const { productWithMetafield, ThemeAndAssets: {mainTheme, themeAsset }, themeAppExtensionId } = loaderData;


  useEffect(() => {
    if(productWithMetafield) {
      if(productWithMetafield?.metafield?.key == "streamly_autograph_input_field") {
        setStreamilyMetafieldExist(true);
      }
      const productWithMetafieldID = productWithMetafield?.id?.replace("gid://shopify/Product/", "");
      setStreamilyProductID(productWithMetafieldID);
    }

    if(themeAsset) {
      const isStreamilyBlockExist = themeAsset.some((item) => {        
        const jsonData = item?.body?.content;
        try {
          // Remove the comment block using a regex to match the comments and strip them
          const cleanedJsonData = jsonData?.replace(/\/\*[\s\S]*?\*\//g, '').trim();
          const parsedData = JSON.parse(cleanedJsonData);
          const themeBlocks = parsedData?.sections?.main?.blocks;
          const filteredThemeBlock = themeBlocks && Object.values(themeBlocks).find((singleBlock) => {
            return singleBlock.type && singleBlock.type.includes('streamily-autographs');
          });
          return filteredThemeBlock ? true : false;
        } catch(error) {
          console.error("Error while parsing JSON", error);
          return false;
        }
      });
      // console.log('isStreamilyBlockExist:', isStreamilyBlockExist);
      setStreamilyThemeBlockExist(isStreamilyBlockExist);
    }

    if(mainTheme) {
      const raw_themeId = mainTheme?.node?.id;
      const theme_Id = raw_themeId.replace('gid://shopify/OnlineStoreTheme/', '');
      setThemeId(theme_Id);
    }

    if(shopify) {
      const SHOP = shopify?.config?.shop;
      if (SHOP && themeAppExtensionId) {  
          // console.log("themeAppExtensionId 11:", themeAppExtensionId);
          const appBlock_DeepLink = `https://${SHOP}/admin/themes/current/editor?template=product&addAppBlockId=${themeAppExtensionId}/app-block&target=mainSection`;
          setAppBlockDeepLink(appBlock_DeepLink);  
      }
    }

  }, [shopify, productWithMetafield, themeAsset, mainTheme, themeAppExtensionId]);


  useEffect(() => {
    // console.log('streamilyMetafieldExist :', streamilyMetafieldExist);
    // console.log('streamilyThemeBlockExist :', streamilyThemeBlockExist);
    if (streamilyMetafieldExist) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === 0 ? { ...item, complete: true } : item
        )
      );
    }
    if (streamilyThemeBlockExist) {
      setItems((prev) =>
        prev.map((item) =>
          item.id === 1 ? { ...item, complete: true } : item
        )
      );
    }
  }, [streamilyMetafieldExist, streamilyThemeBlockExist]);


  // Step complete handler, adjust for your use case
  const onStepComplete = async (id) => {
    console.log("onStepComplete", id);

    try {
      // API call to update completion state in DB, etc.
      await new Promise((res) =>
        setTimeout(() => {
          res();
        }, [1000]),
      );

      setItems((prev) =>
        prev.map((item) =>
          item.id === id ? { ...item, complete: !item.complete } : item,
        ),
      );
    } catch (e) {
      console.error(e);
    }
  };



  return (
    <Page>
      <TitleBar title="Streamily Setup Guide" />
      <Layout>
        <Layout.Section>
          <BlockStack gap={100}>

            <Banner tone="info" title="The Setup Guide helps you configure settings for your online store!" >
              <BlockStack gap={300}>
                <Text as="h3" variant="headingLg">
                  {streamilyMetafieldExist && streamilyThemeBlockExist
                    ? "Streamily Autographs settings configured in your store" 
                    : "To enable Streamily Autographs in your store, please configure the following settings."}
                </Text>

                <BlockStack gap={100}>
                  <Text as="p" variant="bodyLg" fontWeight="regular">
                    {`➺`} {streamilyMetafieldExist 
                      ? "The Admin App Block is added and enabled for a product." 
                      : "Add the Admin App Block in the product settings page."}
                  </Text>
                  <Text as="p" variant="bodyLg" fontWeight="regular">
                    {`➺`} {streamilyThemeBlockExist 
                      ? "The Theme App Block has been added in the theme editor customizer." 
                      : "Add the Theme App Block to your theme editor customizer."}
                  </Text>
                </BlockStack>

                {!showGuide && (
                  <InlineStack>
                    <Button onClick={() => setShowGuide(true)}>
                      View Setup Guide
                    </Button>
                  </InlineStack>
                )}
              </BlockStack>
            </Banner>

            {/* {!showGuide ? (
              <>
                <Card>
                  <Banner tone="info" title="Follow the personalized guide to set up your app effortlessly!" >
                    <InlineStack>
                      <Button onClick={() => setShowGuide(true)}>
                        Show Setup Guide
                      </Button>
                    </InlineStack>
                  </Banner>
                </Card>
              </>
            ) : (
              <>
                <div className="max-w-[60rem] m-auto">
                  <SetupGuide
                    onDismiss={() => {
                      setShowGuide(false);
                      setItems(ITEMS);
                    }}
                    onStepComplete={onStepComplete}
                    items={items}
                    productID={streamilyProductID}
                    deepLink={appBlockDeepLink}
                  />
                </div>
              </>
            )} */}

          </BlockStack>
        </Layout.Section>
      </Layout>
    </Page>
  );
}

// SETUP COMPONENT API DATA
const ITEMS = [
  {
    id: 0,
    title: "Add admin app block in your product",
    description:
      "Admin App Block - Add 'Streamily-Autographs' app block in your products. ",
    image: {
      url: `${AddAdminAppBlock}`,
      alt: "Admin App Block Image",
      url2: `${AddedAdminAppBlockYes}`,
      alt2: "Admin App Block Added Image",
    },
    complete: false,
    primaryButton: {
      content: "Add admin app block",
      props: {
        url: `shopify:admin/products?selectedView=all`,
        external: "true",
      },
    },
    secondaryButton: {
      content: "Go to Products",
      props: {
        url: "shopify:admin/products?selectedView=all",
        external: "true",
      },
    },
  },
  {
    id: 1,
    title: "Add theme app block in your online store",
    description:
      "Theme App Block - Add our 'Streamily-Fields' app block in your theme editor.",
    image: {
      url: `${AddThemeAppBlock}`,
      alt: "Theme App Block Image",
      url2: `${AddThemeAppBlockYes}`,
      alt2: "Theme App Block Added Image",
    },
    complete: false,
    primaryButton: {
      content: "Add theme app block",
      props: {
        url: `shopify:admin/themes`,
        external: "true",
      },
    },
    secondaryButton: {
      content: "Copy Store Link",
      props: {
        url: "shopify:admin/themes",
        external: "true",
      },
    },
  },
  {
    id: 2,
    title: "Translate your store",
    description: "Translating your store improves cross-border conversion by an average of 13%. Add languages for your top customer regions for localized browsing, notifications, and checkout.",
    image: {
      url: "https://cdn.shopify.com/b/shopify-guidance-dashboard-public/nqjyaxwdnkg722ml73r6dmci3cpn.svgz",
    },
    complete: false,
    primaryButton: {
      content: "Add a language",
      props: {
        url: "https://www.example.com",
        external: 'true',
      },
    },
  },
];
