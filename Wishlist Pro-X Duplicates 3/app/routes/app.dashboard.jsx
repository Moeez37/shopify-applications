import { useEffect, useState } from "react";
import { authenticate } from "../shopify.server";
import { useLoaderData } from "@remix-run/react";
import {
  Layout,
  Page,
} from "@shopify/polaris";
import { WishlistActions } from "./dashboard/components/WishlistActions";
import { fetchProductUsingIds, shopWishlistData } from "./dashboard/dashboard.server";
import { WishlistProducts } from "./dashboard/components/WishlistProducts";
import { WishlistActivities } from "./dashboard/components/WishlistActivities";
import { useAppBridge } from "@shopify/app-bridge-react";


export const loader = async ({ request }) => {
  console.log(" === Dashboard Loader === ");
  const { admin, session } =  await authenticate.admin(request);
  if(!session) {
    console.log("Session is not defined!");
    return null;
  }

  const sessionShop = session?.shop;
  const wishlistDBData = await shopWishlistData(sessionShop);
  // console.log("wishlistDBData :", wishlistDBData);

  let wishlistedProducts;
  if(wishlistDBData && wishlistDBData?.data?.length > 0) {
    wishlistedProducts = await fetchProductUsingIds(admin, wishlistDBData.data);
  }
  // console.log("wishlistedProducts :", wishlistedProducts);

  return {
    wishlistDBData,
    wishlistedProducts, 
  };
};

export const action = async ({ request }) => {
  await authenticate.admin(request);  
  return null;
};


export default function Dashboard() {
  const loader = useLoaderData();  
  const shopify = useAppBridge();

  const [wishlistShopDBData, setWishlistShopDBData] = useState([]);
  const [wishlistedProductsData, setWishlistedProductsData] = useState([]);
  const [sharedTime, setSharedTime] = useState(0);

  const { wishlistDBData, wishlistedProducts } = loader;
  
  useEffect(() => {
    if(wishlistDBData && wishlistDBData?.success) {
      // console.log('wishlistDBData', wishlistDBData);
      setWishlistShopDBData(wishlistDBData?.data);
      setSharedTime(wishlistDBData?.sharedWishlists);
    };

    if(wishlistedProducts && wishlistedProducts?.length > 0) {
      // console.log("wishlistedProducts :", wishlistedProducts);
      setWishlistedProductsData(wishlistedProducts);
    };
  }, [wishlistDBData, wishlistedProducts]);



  return (
    <Page >
      <Layout>
        <Layout.Section>
          <WishlistActions wishlistShopDBData={wishlistShopDBData} sharedTime={sharedTime}/>
        </Layout.Section>

        <Layout.Section>
          <WishlistProducts wishlistedProductsData={wishlistedProductsData}/>
        </Layout.Section>

        <Layout.Section>
          <WishlistActivities wishlistedProductsData={wishlistedProductsData} shopify={shopify} />
        </Layout.Section>
      </Layout>
    </Page>
  );
}
