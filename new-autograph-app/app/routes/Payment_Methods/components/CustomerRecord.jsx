import { Card, BlockStack, Text, Banner, EmptyState } from "@shopify/polaris";

export const CustomerRecord = ({customerSRecord, receiptEmail}) => {
  // console.log("customerSRecord :", customerSRecord);
  // console.log("receiptEmail :", receiptEmail);

  const formatDateToDisplay = (timestamp) => {
    return timestamp ? new Date(timestamp * 1000).toLocaleDateString() : "Unknown";
  };

  const renderCustomerDetails = () => (
    <Card title="Customer Details" sectioned>
      <BlockStack gap={300}>
        <BlockStack gap={200} align="start">
          <Text as="h2" variant="headingMd">
            Email: {customerSRecord.email || "Not provided"}
          </Text>
          <Text as="p" variant="bodyMd">
            <strong> Name: </strong> {customerSRecord.name || "Not provided"}
          </Text>
          <Text as="p" variant="bodyMd">
            <strong> Description: </strong> {customerSRecord.description || "Not provided"}
          </Text>
          <Text as="p" variant="bodyMd">
           <strong> Phone: </strong>{customerSRecord.phone || "Not provided"}
          </Text>
          <Text as="p" variant="bodyMd">
           <strong> Address: </strong> {customerSRecord.address || "Not provided"}
          </Text>
          <Text as="p" variant="bodyMd">
            <strong> Creation Date: </strong> {formatDateToDisplay(customerSRecord.created)}
          </Text>
          {/* <Text as="p" variant="bodyMd">
            <strong> Balance: </strong> {customerSRecord.balance ? `$${customerSRecord.balance}` : "$0"}
          </Text> */}
          <Text as="p" variant="bodyMd">
            <strong> Currency: </strong>{customerSRecord.currency || "Not specified"}
          </Text>
        </BlockStack>
        <Banner
          title="Notice"
          status="info"
          onDismiss={() => console.log("Banner dismissed")}
        >
          <p>Ensure the information is accurate and up-to-date.</p>
        </Banner>
      </BlockStack>
    </Card>
  );
  
  const renderEmptyState = () => (
    <Card sectioned>
      <EmptyState
        heading="No Records Found!"
        // action={{content: 'Upload files'}}
        image="https://cdn.shopify.com/s/files/1/0262/4071/2726/files/emptystate-files.png"
        fullWidth
      >
        <Text as="p" variant="bodyMd">
          Choose a payment method to proceed. The email {''} <strong>{receiptEmail}</strong> {''}
          will be linked to the selected payment method.
        </Text>
      </EmptyState>
    </Card>
  );


  return (
    <>
      <Card>
        <BlockStack gap={500}>
          <Text as="p" variant="bodyMd">
            Customer details linked to the payment method
          </Text>
          {customerSRecord ? renderCustomerDetails() : renderEmptyState()}
        </BlockStack>
      </Card>
    </>
  );
};

      {/* <CalloutCard
        title="Customer Info"
        // illustration="https://cdn.shopify.com/s/assets/admin/checkout/settings-customizecart-705f57c725ac05be5a34ec20c05b94298cb8afd10aac7bd9c7ad02030f48cfa0.svg"
        primaryAction={{
          content: "Edit Email from shop",
          // url: '#',
        }}
      >
        <BlockStack gap={500}>
          <Text as="p" variant="bodyMd">
            Customer details linked to the payment method
          </Text>
          {customerSRecord1 ? renderCustomerDetails() : renderEmptyState()}
        </BlockStack>
      </CalloutCard> */}