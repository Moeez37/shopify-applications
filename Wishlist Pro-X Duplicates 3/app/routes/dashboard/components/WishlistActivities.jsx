import { useEffect, useMemo, useState } from "react";
import { BlockStack, Button, Card, Icon, InlineStack, Text } from "@shopify/polaris";
import { CartIcon, HeartIcon } from "@shopify/polaris-icons";
import { Bar, BarChart, Line, LineChart, Rectangle, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";

export const WishlistActivities = ({ wishlistedProductsData, shopify }) => {
  const [itemLength, setItemLength] = useState(0);
  const [barChartWidth, setBarChartWidth] = useState(95);

  const [shopiDomain, setShopiDomain] = useState('');

  useEffect(() => {
    // console.log("shopify :", shopify);
    if(shopify) {
      setShopiDomain(shopify?.config?.shop);
    }
  }, [shopify]);


  useEffect(() => {
    // console.log("wishlistedProductsData :", wishlistedProductsData);
    if(wishlistedProductsData && wishlistedProductsData.length > 0) {
      setItemLength(wishlistedProductsData.length);
    }
  }, [wishlistedProductsData]);
  
  useEffect(() => {
    // console.log("itemLength :", itemLength);
    // console.log("barChartWidth :", barChartWidth); 
    if(itemLength == 1) {
      setBarChartWidth(22);
    } else if(itemLength == 2) {
      setBarChartWidth(33);
    } else if(itemLength == 3) {
      setBarChartWidth(44);
    } else if(itemLength == 4) {
      setBarChartWidth(55);
    } else if (itemLength >= 5 && itemLength <= 8) {
      setBarChartWidth(70);
    } else {
      setBarChartWidth(95);
    }
  }, [itemLength]);


  const chartData = useMemo(() => {
    if (!wishlistedProductsData || wishlistedProductsData.length === 0) {
      return [{ name: "No Data", wishlistCount: 0, addToCartCount: 0 }];
    }

    return wishlistedProductsData?.map((item) => ({
      name: item.productData?.title || "",
      wishlistCount: item.add_wl_count || 0,
      addToCartCount: item.add_to_cart || 0,
    }));
  }, [wishlistedProductsData]);


  return (
    <div style={{marginBottom:'1.5rem' }}>
      <BlockStack gap={100}>
        <Text as="h3" variant="headingMd">
          Wishlist Activities
        </Text>

        <Card>
          <BlockStack gap={500}>
            <BlockStack gap={200}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <span> <Icon source={HeartIcon} tone="critical" /> </span>
                <Text as="h5" variant="headingMd"> Added to Wishlist Activity </Text>
              </div>

              <Text as="h5" variant="headingSm" fontWeight="regular" tone="critical"> 
                * It show how many times each product was added to the wishlist.
              </Text>
            </BlockStack>

            <ResponsiveContainer 
              width={barChartWidth + '%'}
              height={385}
            >
              <BarChart 
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="wishlistCount" fill="#4287f5" activeBar={<Rectangle fill="#8884d8" />} />
              </BarChart>
            </ResponsiveContainer>
          </BlockStack>
        </Card>

        <Card>
          <BlockStack gap={500}>
            <BlockStack gap={200}>
              <div style={{ display: 'flex', gap: '5px' }}>
                <span> <Icon source={CartIcon} tone="critical" /> </span>
                <Text as="h5" variant="headingMd"> Added to Cart from Wishlist Page </Text>
              </div>

              <Text as="h5" variant="headingSm" fontWeight="regular" tone="critical">
                * It shows how many times each product was added to the cart from the wishlist page.
              </Text>
            </BlockStack>

            <ResponsiveContainer width="95%" height={375}>
              <LineChart
                data={chartData} 
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line 
                  type="monotone" 
                  dataKey="addToCartCount" 
                  stroke="#8884d8" 
                  activeDot={{ r: 8 }} 
                />
              </LineChart>
            </ResponsiveContainer>
          </BlockStack>
        </Card>

      </BlockStack>
    </div>
  );
};
