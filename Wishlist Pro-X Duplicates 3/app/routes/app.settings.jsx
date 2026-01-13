import { useEffect, useState } from "react";
import { TitleBar, useAppBridge } from "@shopify/app-bridge-react";
import { authenticate } from "../shopify.server";
import { Form, useActionData, useLoaderData } from "@remix-run/react";
import prismaDb from '../db.server'; //prismaDb contains all the models
import {
  Box,
  Card,
  Layout,
  Link,
  List,
  Page,
  Text,
  BlockStack,
  InlineGrid,
  useBreakpoints,
  TextField,
  Divider,
  Button,
  InlineStack,
} from "@shopify/polaris";


export const loader = async ({ request }) => {
  console.log(" === Settings Loader === ");
  const { admin, session: { shop } } = await authenticate.admin(request);

  // Default settings if no settings are found in the database
  let defaultSettings = {
    beforeLabel: "Add to Wishlist",
    afterLabel: "Added to Wishlist",
  };

  try {
    // Fetch settings from the database
    let settingsDB = await prismaDb.wishlistSettings.findFirst({where: {id: shop } }); //findFirst returns first row in db table
    console.log("Settings from DB:", settingsDB);
    
    return {
      settings: settingsDB ?? defaultSettings, // Use default if settingsDB is null/undefined
    };
  } catch (error) {
    console.error("Error fetching settings:", error);
    return { settings: defaultSettings }; // Return defaults in case of an error
  }

  // return { settings: defaultSettings };
};


export const action = async ({ request }) => {
  console.log(" === Settings Action === ");
  
  try {
    const { admin, session: { shop } } = await authenticate.admin(request);
    // console.log("shop :", shop);
    
    const formData = await request.formData();
    // console.log("formData :", formData);

    const { beforeLabel, afterLabel } = Object.fromEntries(formData.entries());
    

    if(shop && beforeLabel && afterLabel) {
      // Update database
      // A upsert query updates a related record if it exists, or creates a new related record.
      const updatedSettings = await prismaDb.wishlistSettings.upsert({
        where: {
          id: shop
        },
        create: {
          id: shop,
          shop: shop,
          beforeLabel: beforeLabel,
          afterLabel: afterLabel
        },
        update: {
          shop: shop,
          beforeLabel: beforeLabel,
          afterLabel: afterLabel
        }
      });
      // console.log("updatedSettings :", updatedSettings);
      return {
        settingsResponse: {
          success: true,
          message: "Settings updated successfully",
          settings: updatedSettings,
        },
      };
    }


  } catch (error) {
    console.error("Error updating settings:", error.message);
    return {
      settingsResponse: {
        success: false,
        message: error.message || "Failed to update settings",
      },
    }
  }

  return null;
};


export default function Settings() {
  const { smUp } = useBreakpoints(); //This hook is for responsive
  const loader = useLoaderData();
  const actionData = useActionData();
  const shopify = useAppBridge();

  const { settings } = loader;

  const [formState, setFormState] = useState(settings);
  const [displayFormState, setDisplayFormState] = useState(settings);
  

  useEffect(() => {
    // console.log("settings :", settings);
    // console.log("actionData :", actionData);
    if(actionData?.settingsResponse?.settings) {
      shopify.toast.show(actionData.settingsResponse.message);
      setDisplayFormState(actionData.settingsResponse.settings)
    }

  }, [shopify, actionData, settings]);


  return (
    <Page >
      <TitleBar title="Settings" />
      <Layout>
        <Layout.Section>
          <BlockStack gap={{ xs: "800", sm: "400" }}>
            <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap={400}>
              <Box
                as="section"
                paddingInlineStart={{ xs: 400, sm: 0 }}
                paddingInlineEnd={{ xs: 400, sm: 0 }}
              >
                <BlockStack gap={300}>
                  <Text as="h3" variant="headingMd">
                    Settings
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Update App settings and preferences.
                  </Text>
                </BlockStack>
              </Box>
              <Card>
                <Form method="POST">
                  <BlockStack gap={400}>
                    <TextField 
                      label="Change Button Label (Before Adding Item)" 
                      name="beforeLabel"
                      value={formState?.beforeLabel}
                      onChange={(value) => setFormState({ ...formState, beforeLabel: value })}
                    />
                    <TextField 
                      label="Change Button Label (After Adding Item)" 
                      name="afterLabel"
                      value={formState?.afterLabel}
                      onChange={(value) => setFormState({ ...formState, afterLabel: value })}
                    />
                    <InlineStack align="end">
                      <Button submit={true} size="slim">
                        Save Changes
                      </Button>
                    </InlineStack>
                  </BlockStack>
                </Form>
              </Card>
            </InlineGrid>
          </BlockStack>
        </Layout.Section>

        <Layout.Section variant="oneThird">
          <Card roundedAbove="sm">
            <BlockStack gap={600}>
              <Text as="h3" variant="headingMd" fontWeight="regular">
                Button Label
              </Text>
              <BlockStack gap={300}>  
                <TextField value={displayFormState.beforeLabel} size="slim" readOnly />
                <TextField value={displayFormState.afterLabel} size="slim" readOnly />
              </BlockStack>
            </BlockStack>
          </Card>
        </Layout.Section>


        {/* <Layout.Section>
          <BlockStack gap={{ xs: "800", sm: "400" }}>
            
            {smUp ? <Divider /> : null}
          
            <InlineGrid columns={{ xs: "1fr", md: "2fr 5fr" }} gap="400">
              <Box
                as="section"
                paddingInlineStart={{ xs: 400, sm: 0 }}
                paddingInlineEnd={{ xs: 400, sm: 0 }}
              >
                <BlockStack gap="400">
                  <Text as="h3" variant="headingMd">
                    Dimensions
                  </Text>
                  <Text as="p" variant="bodyMd">
                    Interjambs are the rounded protruding bits of your puzzlie piece
                  </Text>
                </BlockStack>
              </Box>
              <Card roundedAbove="sm">
                <BlockStack gap="400">
                  <TextField label="Horizontal" />
                  <TextField label="Interjamb ratio" />
                </BlockStack>
              </Card>
            </InlineGrid>

          </BlockStack>
        </Layout.Section> */}

      </Layout>
    </Page>
  );
}
