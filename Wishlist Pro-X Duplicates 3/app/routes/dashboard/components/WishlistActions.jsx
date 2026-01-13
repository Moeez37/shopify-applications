import { useEffect, useState } from "react";
import { BlockStack, Card, Icon, InlineStack, Text } from "@shopify/polaris";
import {
  CartIcon,
  HeartIcon,
  ShareIcon
} from '@shopify/polaris-icons';


export const WishlistActions = ({ wishlistShopDBData, sharedTime }) => {
  const [addToWishlistTotalAction, setaddToWishlistTotalAction] = useState(0);
  const [removeToWishlistTotalAction, setRemoveToWishlistTotalAction] = useState(0);
  const [addToCartTotalAction, setAddToCartTotalAction] = useState(0);
  
  useEffect(() => {
    // console.log("wishlistShopDBData :", wishlistShopDBData);
    // console.log("sharedTime :", sharedTime);

    if(wishlistShopDBData && wishlistShopDBData?.length > 0) {
      let total_ADD_WL_Count = 0;
      let total_REMOVE_WL_Count = 0;
      let total_Add_to_cart_count = 0;

      wishlistShopDBData.forEach((singleObj) => {
        // console.log("singleObj :", singleObj);
        total_ADD_WL_Count += singleObj?.add_wl_count;
        total_REMOVE_WL_Count += singleObj?.remove_wl_count;
        total_Add_to_cart_count += singleObj?.add_to_cart;
      });
      
      // console.log("total_ADD_WL_Count :", total_ADD_WL_Count);
      // console.log("total_REMOVE_WL_Count :", total_REMOVE_WL_Count);
      // console.log("total_Add_to_cart_count :", total_Add_to_cart_count);
      
      setaddToWishlistTotalAction(total_ADD_WL_Count);
      setRemoveToWishlistTotalAction(total_REMOVE_WL_Count);
      setAddToCartTotalAction(total_Add_to_cart_count);
    };
  }, [wishlistShopDBData, sharedTime]);


  return (
    <div>
      <BlockStack gap={100}>
        <Text as="h3" variant="headingMd">
          Wishlist Actions
        </Text>

        <Card>
          <InlineStack gap={200}>
            <div style={{ width: "32%" }}>
              <Card background="bg-fill-info-hover">
                <BlockStack gap={400}>
                  <div style={{display:'flex', gap:'5px'}}>
                    <span> <Icon source={HeartIcon} tone="critical" /> </span>
                    <Text as="h5" variant="headingSm">Added to Wishlist</Text>
                  </div>
                  <Text as="h1" variant="headingLg" numeric> 
                    {addToWishlistTotalAction || 0} 
                  </Text>
                </BlockStack>
              </Card>
            </div>

            <div style={{ width: "33%" }}>
              <Card background="bg-fill-info-hover">
                <BlockStack gap={400}>
                  <Text as="h5" variant="headingSm">Removed from Wishlist</Text>
                  <Text as="h1" variant="headingLg" numeric>
                    {removeToWishlistTotalAction || 0}
                  </Text>
                </BlockStack>
              </Card>
            </div>

            <div style={{ width: "32%" }}>
              <Card background="bg-fill-info-hover">
                <BlockStack gap={400}>
                  <div style={{display:'flex', gap:'5px'}}>
                    <span> <Icon source={CartIcon} tone="critical" /> </span>
                    <Text as="h5" variant="headingSm">Added to Cart from Wishlist</Text>
                  </div>
                  
                  <Text as="h1" variant="headingLg" numeric>
                    {addToCartTotalAction || 0}
                  </Text>
                </BlockStack>
              </Card>
            </div>

            <div style={{ width: "32%" }}>
              <Card background="bg-fill-info-hover">
                <BlockStack gap={400}>
                  <div style={{display:'flex', gap:'5px'}}>
                    <span> <Icon source={ShareIcon} tone="critical" /> </span>
                    <Text as="h5" variant="headingSm"> All time Shared Wishlists </Text>
                  </div>
                  
                  <Text as="h1" variant="headingLg" numeric> {sharedTime || 0} </Text>
                </BlockStack>
              </Card>
            </div>
            
          </InlineStack>
        </Card>
      </BlockStack>
    </div>
  );
};
