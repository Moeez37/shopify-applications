import { Avatar, BlockStack, Button, Card, DataTable, Divider, EmptyState, Icon, InlineStack, ResourceItem, ResourceList, Text, useBreakpoints } from "@shopify/polaris";
import { ProductIcon, ProductListIcon, ProductReferenceIcon } from "@shopify/polaris-icons";
import { useEffect, useState } from "react";

export const WishlistProducts = ({ wishlistedProductsData }) => {
  const [totalProductsWishlisted, setTotalProductsWishlisted] = useState(0);
  const [popularWishlistProduct, setPopularWishlistProduct] = useState({});
  const [recentlyUpdatedProduct, setRecentlyUpdatedProduct] = useState({});
  const [preloadedImages, setPreloadedImages] = useState({});

  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    // console.log("wishlistedProductsData :", wishlistedProductsData);
    // console.log("popularWishlistProduct :", popularWishlistProduct);
    // console.log("recentlyUpdatedProduct :", recentlyUpdatedProduct);


    if(wishlistedProductsData && wishlistedProductsData.length > 0) {
      setTotalProductsWishlisted(wishlistedProductsData.length);
      

      // Find the product with the highest wishlist count
      const maxCountProduct = wishlistedProductsData.reduce((max, item) => (
        item.add_wl_count > max.add_wl_count ? item : max
      ), wishlistedProductsData[0]);

      if(maxCountProduct?.productData) {
        setPopularWishlistProduct(maxCountProduct.productData);
      }

      
      // Find the most recently updated product
      const sortedByUpdate = [...wishlistedProductsData].sort(
        (a, b) => new Date(b.updatedAt) - new Date(a.updatedAt)
      );

      if (sortedByUpdate[0]?.productData) {
        setRecentlyUpdatedProduct(sortedByUpdate[0].productData);
      }


      // Preload images
      const imageCache = {};
      wishlistedProductsData.forEach((item) => {
        const imageUrl = item?.productData?.image;
        if (imageUrl) {
          const img = new Image();
          img.src = imageUrl;
          imageCache[item.productData.id] = imageUrl; // Store preloaded image
        }
      });
    
      setPreloadedImages(imageCache);
    };
  }, [wishlistedProductsData]);



  const rows = wishlistedProductsData?.filter(item => item?.productData).map((item) => {
    // console.log("item:", item);
    const {add_wl_count, productId, productData: {id, title, image, status, totalInventory} } = item;

    const productImage = (
      <img 
        // src={image || null} 
        src={preloadedImages[id] || image} 
        alt={title || 'Product Image'} 
        style={{ width: "40px", borderRadius: "5px" }} 
      />
    );

    const productTitle = (
      <Button variant="plain" target='_top' url={`shopify:admin/products/${productId}`} >
        <Text as="h3" variant="headingMd" tone="inherit">
          {title || 'Product Title'}
        </Text>
      </Button>
    );

    const inventoryLVL = (
      <Text as="h3" variant="headingSm" fontWeight="regular" numeric>
        {totalInventory}
      </Text>
    );

    return [
      productImage,
      productTitle,
      status,
      add_wl_count || 0,
      inventoryLVL,
    ];
  });

  const rowsPerPage = 5;
  const totalPages = Math.ceil(rows.length / rowsPerPage);
  // console.log("totalPages :", totalPages);

  const rowsForRender = rows.slice((currentPage - 1) * rowsPerPage, currentPage * rowsPerPage );
  const missingRows = rowsPerPage - rowsForRender.length;

  const emptyRowFill = (<div style={{height:'44px'}}></div>);
  const emptyRow = [emptyRowFill, emptyRowFill, emptyRowFill, emptyRowFill, emptyRowFill, emptyRowFill, emptyRowFill];
  const emptyRows = Array.from({ length: missingRows }, () => emptyRow);

  const finalRows = [...rowsForRender, ...emptyRows];
  // console.log("finalRows :", finalRows);


  const handleNextPage = () => {
    setCurrentPage((prevPage) => Math.min(prevPage + 1, totalPages));
  };
  
  const handlePreviousPage = () => {
    setCurrentPage((prevPage) => Math.max(prevPage - 1, 1));
  };

  const paginationSettings = {
    type: 'table',
    label: `showing ${rowsForRender.length} records- page ${currentPage} / ${totalPages}`,
    nextTooltip: 'Next Page',
    previousTooltip: 'Previous Page',
    hasNext: currentPage < totalPages,
    hasPrevious: currentPage > 1,
    onNext: handleNextPage,
    onPrevious: handlePreviousPage,
  };

  const { lgDown } = useBreakpoints();
  const fixedFirstColumns = lgDown ? 2 : 0;


  return (
    <div>
      <BlockStack gap={100}>
        <Text as="h3" variant="headingMd">
          Wishlist Products
        </Text>

        <Card>
          <InlineStack gap={500}>
            <div style={{ width: '66%' }}>
              <BlockStack gap={200}>
                <Text>
                  Most popular wishlist products
                </Text>

                <Card>
                  {wishlistedProductsData && wishlistedProductsData?.length > 0 ? (
                    <DataTable
                      rows={finalRows}
                      columnContentTypes={["text", "text", "text", "numeric", "numeric"]}
                      headings={["Product", "Title", "Status", "Wishlist Count", "Inventory Available"]}
                      sortable={[false, true, false, true, true]}
                      defaultSortDirection="descending"
                      initialSortColumnIndex={3}
                      stickyHeader
                      fixedFirstColumns={fixedFirstColumns}
                      pagination={paginationSettings}
                    />
                  ): (
                    <EmptyState
                      heading="No Wishlisted Products Found"
                      image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
                      fullWidth
                    >
                      <p>
                        Boost customer engagement by adding a wishlist to your store! Let shoppers save their favorites and return to buy anytime.
                      </p>
                    </EmptyState>
                  )}
                </Card>
              </BlockStack>
            </div>

            <div style={{ width: "31%", paddingTop:'1.7rem' }}>
              <BlockStack gap={400}>
                <Card background="bg-surface-info-active">
                  <BlockStack gap={500}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <span> <Icon source={ProductListIcon} tone="critical" /> </span>
                      <Text as="h3" variant="headingMd">Products Wishlisted</Text>
                    </div>

                    <Text as="h1" variant="headingLg" numeric>
                      {totalProductsWishlisted || 0}
                    </Text>
                  </BlockStack>
                </Card>

                <Card background="bg-surface-info-active">
                  <BlockStack gap={200}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <span> <Icon source={ProductIcon} tone="critical" /> </span>
                      <Text as="h3" variant="headingMd"> Most Wishlisted Product </Text>
                    </div>

                    <ResourceList
                      resourceName={{ singular: "product", plural: "products" }}
                      items={[popularWishlistProduct]}
                      renderItem={(item) => {
                        const { id, title, status, image } = item;
                        return (
                          <ResourceItem
                            id={id}
                            verticalAlignment="fill"
                            media={<Avatar source={image} alt={title} size="xl" />}
                            name={title}
                          >
                            <Text variant="bodyMd" fontWeight="bold">
                              {title}
                            </Text>
                            <Text variant="bodySm" color="subdued">
                              {status ? `Status: ${status} `: ''}
                            </Text>
                          </ResourceItem>
                        );
                      }}
                    />
                  </BlockStack>
                </Card>

                <Card background="bg-surface-info-active">
                  <BlockStack gap={200}>
                    <div style={{ display: 'flex', gap: '5px' }}>
                      <span> <Icon source={ProductReferenceIcon} tone="critical" /> </span>
                      <Text as="h3" variant="headingMd"> Recently Wishlisted Product </Text>
                    </div>

                    <ResourceList
                      resourceName={{ singular: "product", plural: "products" }}
                      items={[recentlyUpdatedProduct]}
                      renderItem={(item) => {
                        const { id, title, status, image } = item;
                        return (
                          <ResourceItem
                            id={id}
                            verticalAlignment="fill"
                            media={<Avatar source={image} alt={title} size="xl" />}
                            name={title}
                          >
                            <Text variant="bodyMd" fontWeight="bold">
                              {title}
                            </Text>
                            <Text variant="bodySm" color="subdued">
                              {status ? `Status: ${status} `: ''}
                            </Text>
                          </ResourceItem>
                        );
                      }}
                    />
                  </BlockStack>
                </Card>

              </BlockStack>
            </div>
          </InlineStack>

        </Card>
      </BlockStack>
    </div>
  );
};
