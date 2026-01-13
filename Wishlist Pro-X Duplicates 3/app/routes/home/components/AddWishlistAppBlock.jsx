import { useState } from "react";
import { Banner, BlockStack, Button, ButtonGroup, Card, InlineStack, Modal, Text, Tooltip } from "@shopify/polaris";
import { ExternalSmallIcon } from '@shopify/polaris-icons';
import ProductButton from '../../../assets/ProductButton.mp4';
import FloatingButton from '../../../assets/FloatingButton.mp4';
import CollectionPages from '../../../assets/CollectionPages.mp4';

export const AddWishlistAppBlockProduct = ({ appBlockProductDeepLink }) => {
  const [videoPreviewModal, setVideoPreviewModal] = useState(false);

  const handleWatchVideoClick = () => {
    setVideoPreviewModal(true);
  };

  const handleVideoModalClose = () => {
    setVideoPreviewModal(false);
  };

  return (
    <>
      <EnablerMessage />

      <Card>
        <BlockStack gap={500}>
          <BlockStack gap={100}>
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack align="start" blockAlign="center" gap={300}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#8E1F0B" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" fill="#8E1F0B" d="M10.5334 2.10692C11.0126 2.03643 11.5024 2 12 2C12.4976 2 12.9874 2.03643 13.4666 2.10692C14.013 2.18729 14.3908 2.6954 14.3104 3.2418C14.23 3.78821 13.7219 4.166 13.1755 4.08563C12.7924 4.02927 12.3999 4 12 4C11.6001 4 11.2076 4.02927 10.8245 4.08563C10.2781 4.166 9.76995 3.78821 9.68958 3.2418C9.6092 2.6954 9.987 2.18729 10.5334 2.10692ZM7.44122 4.17428C7.77056 4.61763 7.67814 5.24401 7.23479 5.57335C6.603 6.04267 6.04267 6.603 5.57335 7.23479C5.24401 7.67814 4.61763 7.77056 4.17428 7.44122C3.73094 7.11188 3.63852 6.4855 3.96785 6.04216C4.55386 5.25329 5.25329 4.55386 6.04216 3.96785C6.4855 3.63852 7.11188 3.73094 7.44122 4.17428ZM16.5588 4.17428C16.8881 3.73094 17.5145 3.63852 17.9578 3.96785C18.7467 4.55386 19.4461 5.25329 20.0321 6.04216C20.3615 6.4855 20.2691 7.11188 19.8257 7.44122C19.3824 7.77056 18.756 7.67814 18.4267 7.23479C17.9573 6.603 17.397 6.04267 16.7652 5.57335C16.3219 5.24401 16.2294 4.61763 16.5588 4.17428ZM3.2418 9.68958C3.78821 9.76995 4.166 10.2781 4.08563 10.8245C4.02927 11.2076 4 11.6001 4 12C4 12.3999 4.02927 12.7924 4.08563 13.1755C4.166 13.7219 3.78821 14.23 3.2418 14.3104C2.6954 14.3908 2.18729 14.013 2.10692 13.4666C2.03643 12.9874 2 12.4976 2 12C2 11.5024 2.03643 11.0126 2.10692 10.5334C2.18729 9.987 2.6954 9.6092 3.2418 9.68958ZM20.7582 9.68958C21.3046 9.6092 21.8127 9.987 21.8931 10.5334C21.9636 11.0126 22 11.5024 22 12C22 12.4976 21.9636 12.9874 21.8931 13.4666C21.8127 14.013 21.3046 14.3908 20.7582 14.3104C20.2118 14.23 19.834 13.7219 19.9144 13.1755C19.9707 12.7924 20 12.3999 20 12C20 11.6001 19.9707 11.2076 19.9144 10.8245C19.834 10.2781 20.2118 9.76995 20.7582 9.68958ZM4.17428 16.5588C4.61763 16.2294 5.24401 16.3219 5.57335 16.7652C6.04267 17.397 6.603 17.9573 7.23479 18.4267C7.67814 18.756 7.77056 19.3824 7.44122 19.8257C7.11188 20.2691 6.4855 20.3615 6.04216 20.0321C5.25329 19.4461 4.55386 18.7467 3.96785 17.9578C3.63852 17.5145 3.73094 16.8881 4.17428 16.5588ZM19.8257 16.5588C20.2691 16.8881 20.3615 17.5145 20.0321 17.9578C19.4461 18.7467 18.7467 19.4461 17.9578 20.0321C17.5145 20.3615 16.8881 20.2691 16.5588 19.8257C16.2294 19.3824 16.3219 18.756 16.7652 18.4267C17.397 17.9573 17.9573 17.397 18.4267 16.7652C18.756 16.3219 19.3824 16.2294 19.8257 16.5588ZM9.68958 20.7582C9.76995 20.2118 10.2781 19.834 10.8245 19.9144C11.2076 19.9707 11.6001 20 12 20C12.3999 20 12.7924 19.9707 13.1755 19.9144C13.7219 19.834 14.23 20.2118 14.3104 20.7582C14.3908 21.3046 14.013 21.8127 13.4666 21.8931C12.9874 21.9636 12.4976 22 12 22C11.5024 22 11.0126 21.9636 10.5334 21.8931C9.987 21.8127 9.6092 21.3046 9.68958 20.7582Z"></path>
                  <circle cx="12" cy="12" r="12" fill="#8E1F0B" style={{ display: "none" }}></circle>
                  <circle cx="12" cy="12" r="9" fill="#8E1F0B" stroke="#999EA4" strokeWidth="2" style={{ display: "none" }}></circle>
                  <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#8E1F0B"> 1 </text>
                </svg>
                <Text as="h3" variant="headingMd"> Add Wishlist Product Button Widget to your Product Pages. </Text>
              </InlineStack>

              <Tooltip width="wide" content="Watch: How to Add a Wishlist Button to the Product Page">
                <Button onClick={handleWatchVideoClick} size="slim">
                  Preview: Add Product Button 
                </Button>
              </Tooltip>
            </InlineStack>
          
            <Text as="h5" variant="headingMd" fontWeight="regular">
              Let your customers save and buy their favorite products effortlessly.
            </Text>
          </BlockStack>

          <BlockStack gap={200}>
            <Text as="h1" variant="headingMd" fontWeight="bold">
              Steps to Follow
            </Text>
            <BlockStack gap={100} as="li" align="center" inlineAlign="start">
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} Click on 'Add Wishlist ProX Button'
              </Text>
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} <strong>Wishlist ProX Button </strong> will be automatically added to product page 
              </Text>
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} Move the app block upwards
              </Text>
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} Place it below the Buy buttons / Add to cart
              </Text>
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} Save the changes
              </Text>
            </BlockStack>
          </BlockStack>

          <InlineStack>
            <Button variant="primary" url={appBlockProductDeepLink} target="_blank" icon={ExternalSmallIcon}>
              Add Wishlist ProX Button 
            </Button>
          </InlineStack>

        </BlockStack>
      </Card>

      <Modal
        title="How to Add a Wishlist Button to the Product Page!"
        open={videoPreviewModal}
        onClose={handleVideoModalClose}
        size="large"
      >
        <Modal.Section>
          <BlockStack gap={400}>
            <Text as="h3" variant="headingMd" alignment="start" tone="critical">
              You can set up a wishlist in your store's product according to this preview!
            </Text>
            <BlockStack gap={1000}>
              <video width="100%" height="auto" preload="auto" controls autoPlay muted>
                <source src={ProductButton} type="video/mp4" />
                  Your browser does not support the video tag.
              </video>
              <Text as="h3" variant="headingMd" alignment="end" tone="magic">
                Wishlist-ProX
              </Text>
            </BlockStack>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </>
  );
};

const EnablerMessage = () => {
  return (
    <Banner 
      title="Setup below configurations in your Live Theme to start seeing engagement"
      tone="warning"
    />
  )
};


export const AddWishlistAppBlockHeader = ({ appBlockHeaderDeepLink, appEmbedFloatingButtonDeepLink }) => {
  const [videoPreviewModal, setVideoPreviewModal] = useState(false);

  const handleWatchVideoClick = () => {
    setVideoPreviewModal(true);
  };

  const handleVideoModalClose = () => {
    setVideoPreviewModal(false);
  };

  return (
    <>
      <Card>
        <BlockStack gap={500}>
          <BlockStack gap={300}>
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack align="start" blockAlign="center" gap={300}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#8E1F0B" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" fill="#8E1F0B" d="M10.5334 2.10692C11.0126 2.03643 11.5024 2 12 2C12.4976 2 12.9874 2.03643 13.4666 2.10692C14.013 2.18729 14.3908 2.6954 14.3104 3.2418C14.23 3.78821 13.7219 4.166 13.1755 4.08563C12.7924 4.02927 12.3999 4 12 4C11.6001 4 11.2076 4.02927 10.8245 4.08563C10.2781 4.166 9.76995 3.78821 9.68958 3.2418C9.6092 2.6954 9.987 2.18729 10.5334 2.10692ZM7.44122 4.17428C7.77056 4.61763 7.67814 5.24401 7.23479 5.57335C6.603 6.04267 6.04267 6.603 5.57335 7.23479C5.24401 7.67814 4.61763 7.77056 4.17428 7.44122C3.73094 7.11188 3.63852 6.4855 3.96785 6.04216C4.55386 5.25329 5.25329 4.55386 6.04216 3.96785C6.4855 3.63852 7.11188 3.73094 7.44122 4.17428ZM16.5588 4.17428C16.8881 3.73094 17.5145 3.63852 17.9578 3.96785C18.7467 4.55386 19.4461 5.25329 20.0321 6.04216C20.3615 6.4855 20.2691 7.11188 19.8257 7.44122C19.3824 7.77056 18.756 7.67814 18.4267 7.23479C17.9573 6.603 17.397 6.04267 16.7652 5.57335C16.3219 5.24401 16.2294 4.61763 16.5588 4.17428ZM3.2418 9.68958C3.78821 9.76995 4.166 10.2781 4.08563 10.8245C4.02927 11.2076 4 11.6001 4 12C4 12.3999 4.02927 12.7924 4.08563 13.1755C4.166 13.7219 3.78821 14.23 3.2418 14.3104C2.6954 14.3908 2.18729 14.013 2.10692 13.4666C2.03643 12.9874 2 12.4976 2 12C2 11.5024 2.03643 11.0126 2.10692 10.5334C2.18729 9.987 2.6954 9.6092 3.2418 9.68958ZM20.7582 9.68958C21.3046 9.6092 21.8127 9.987 21.8931 10.5334C21.9636 11.0126 22 11.5024 22 12C22 12.4976 21.9636 12.9874 21.8931 13.4666C21.8127 14.013 21.3046 14.3908 20.7582 14.3104C20.2118 14.23 19.834 13.7219 19.9144 13.1755C19.9707 12.7924 20 12.3999 20 12C20 11.6001 19.9707 11.2076 19.9144 10.8245C19.834 10.2781 20.2118 9.76995 20.7582 9.68958ZM4.17428 16.5588C4.61763 16.2294 5.24401 16.3219 5.57335 16.7652C6.04267 17.397 6.603 17.9573 7.23479 18.4267C7.67814 18.756 7.77056 19.3824 7.44122 19.8257C7.11188 20.2691 6.4855 20.3615 6.04216 20.0321C5.25329 19.4461 4.55386 18.7467 3.96785 17.9578C3.63852 17.5145 3.73094 16.8881 4.17428 16.5588ZM19.8257 16.5588C20.2691 16.8881 20.3615 17.5145 20.0321 17.9578C19.4461 18.7467 18.7467 19.4461 17.9578 20.0321C17.5145 20.3615 16.8881 20.2691 16.5588 19.8257C16.2294 19.3824 16.3219 18.756 16.7652 18.4267C17.397 17.9573 17.9573 17.397 18.4267 16.7652C18.756 16.3219 19.3824 16.2294 19.8257 16.5588ZM9.68958 20.7582C9.76995 20.2118 10.2781 19.834 10.8245 19.9144C11.2076 19.9707 11.6001 20 12 20C12.3999 20 12.7924 19.9707 13.1755 19.9144C13.7219 19.834 14.23 20.2118 14.3104 20.7582C14.3908 21.3046 14.013 21.8127 13.4666 21.8931C12.9874 21.9636 12.4976 22 12 22C11.5024 22 11.0126 21.9636 10.5334 21.8931C9.987 21.8127 9.6092 21.3046 9.68958 20.7582Z"></path>
                  <circle cx="12" cy="12" r="12" fill="#8E1F0B" style={{ display: "none" }}></circle>
                  <circle cx="12" cy="12" r="9" fill="#8E1F0B" stroke="#999EA4" strokeWidth="2" style={{ display: "none" }}></circle>
                  <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#8E1F0B"> 2 </text>
                </svg>
                <Text as="h3" variant="headingMd"> Add Wishlist Floating Button Widget OR Header Icon Widget </Text>
              </InlineStack>

              <Tooltip width="wide" content="Watch: How to Add a Floating Button to the Online Store">
                <Button onClick={handleWatchVideoClick} size="slim">
                  Preview: Add Floating Button 
                </Button>
              </Tooltip>
            </InlineStack>

            <Text as="h5" variant="headingMd" fontWeight="regular">
              Keep your customers' wishlisted items in one place, making it easy for them to view and purchase their favorite products effortlessly.
            </Text>
          </BlockStack>

          <BlockStack gap={200}>
            <Text as="h1" variant="headingMd" fontWeight="bold">
              Steps to Follow
            </Text>
            <BlockStack gap={100} as="li" align="center" inlineAlign="start">
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} Go to theme store OR Click on 'Add Floating Button'
              </Text>
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} Add the <strong>Wishlist Header Icon</strong> to the Header block section
              </Text>
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} OR if the Floating Button is enabled, it will be added automatically to your online store.
              </Text>
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} Add <strong>Wishlist Header Icon </strong> to Header Add block section
              </Text>
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} Wishlist Header Icon will be added to Header left side 
              </Text>
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} Save the changes
              </Text>
            </BlockStack>
          </BlockStack>

          <BlockStack gap={200}>
            <ButtonGroup>
              <Button variant="primary" url={appBlockHeaderDeepLink} target="_blank" icon={ExternalSmallIcon}>
                Go to theme store 
              </Button>
              <Button variant="primary" url={appEmbedFloatingButtonDeepLink} target="_blank" icon={ExternalSmallIcon} >
                Add Floating Button 
              </Button>
            </ButtonGroup>

            <Text as="p" variant="bodyMd" tone="critical"> 
              * Add only one option at a time—either the Header Icon or the Floating Button, as both have the same functionality.
            </Text>
          </BlockStack>

        </BlockStack>
      </Card>

      <Modal
        title="How to Add a Wishlist Floating Button to the Online Store!"
        open={videoPreviewModal}
        onClose={handleVideoModalClose}
        size="large"
      >
        <Modal.Section>
          <BlockStack gap={400}>
            <Text as="h3" variant="headingMd" alignment="start" tone="critical">
              You can set up a floating button in your store's according to this preview!
            </Text>
            <BlockStack gap={1000}>
              <video width="100%" height="auto" preload="auto" controls autoPlay muted>
                <source src={FloatingButton} type="video/mp4" />
                  Your browser does not support the video tag.
              </video>
              <Text as="h3" variant="headingMd" alignment="end" tone="magic">
                Wishlist-ProX
              </Text>
            </BlockStack>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </>
  );
};

export const AddWishlistAppBlockCollection = ({ appEmbedCollectionDeepLink }) => {
  const [videoPreviewModal, setVideoPreviewModal] = useState(false);

  const handleWatchVideoClick = () => {
    setVideoPreviewModal(true);
  };

  const handleVideoModalClose = () => {
    setVideoPreviewModal(false);
  };

  return (
    <>
      <Card>
        <BlockStack gap={500}>
          <BlockStack gap={100}>
            <InlineStack align="space-between" blockAlign="center">
              <InlineStack align="start" blockAlign="center" gap={300}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="#8E1F0B" xmlns="http://www.w3.org/2000/svg">
                  <path fillRule="evenodd" clipRule="evenodd" fill="#8E1F0B" d="M10.5334 2.10692C11.0126 2.03643 11.5024 2 12 2C12.4976 2 12.9874 2.03643 13.4666 2.10692C14.013 2.18729 14.3908 2.6954 14.3104 3.2418C14.23 3.78821 13.7219 4.166 13.1755 4.08563C12.7924 4.02927 12.3999 4 12 4C11.6001 4 11.2076 4.02927 10.8245 4.08563C10.2781 4.166 9.76995 3.78821 9.68958 3.2418C9.6092 2.6954 9.987 2.18729 10.5334 2.10692ZM7.44122 4.17428C7.77056 4.61763 7.67814 5.24401 7.23479 5.57335C6.603 6.04267 6.04267 6.603 5.57335 7.23479C5.24401 7.67814 4.61763 7.77056 4.17428 7.44122C3.73094 7.11188 3.63852 6.4855 3.96785 6.04216C4.55386 5.25329 5.25329 4.55386 6.04216 3.96785C6.4855 3.63852 7.11188 3.73094 7.44122 4.17428ZM16.5588 4.17428C16.8881 3.73094 17.5145 3.63852 17.9578 3.96785C18.7467 4.55386 19.4461 5.25329 20.0321 6.04216C20.3615 6.4855 20.2691 7.11188 19.8257 7.44122C19.3824 7.77056 18.756 7.67814 18.4267 7.23479C17.9573 6.603 17.397 6.04267 16.7652 5.57335C16.3219 5.24401 16.2294 4.61763 16.5588 4.17428ZM3.2418 9.68958C3.78821 9.76995 4.166 10.2781 4.08563 10.8245C4.02927 11.2076 4 11.6001 4 12C4 12.3999 4.02927 12.7924 4.08563 13.1755C4.166 13.7219 3.78821 14.23 3.2418 14.3104C2.6954 14.3908 2.18729 14.013 2.10692 13.4666C2.03643 12.9874 2 12.4976 2 12C2 11.5024 2.03643 11.0126 2.10692 10.5334C2.18729 9.987 2.6954 9.6092 3.2418 9.68958ZM20.7582 9.68958C21.3046 9.6092 21.8127 9.987 21.8931 10.5334C21.9636 11.0126 22 11.5024 22 12C22 12.4976 21.9636 12.9874 21.8931 13.4666C21.8127 14.013 21.3046 14.3908 20.7582 14.3104C20.2118 14.23 19.834 13.7219 19.9144 13.1755C19.9707 12.7924 20 12.3999 20 12C20 11.6001 19.9707 11.2076 19.9144 10.8245C19.834 10.2781 20.2118 9.76995 20.7582 9.68958ZM4.17428 16.5588C4.61763 16.2294 5.24401 16.3219 5.57335 16.7652C6.04267 17.397 6.603 17.9573 7.23479 18.4267C7.67814 18.756 7.77056 19.3824 7.44122 19.8257C7.11188 20.2691 6.4855 20.3615 6.04216 20.0321C5.25329 19.4461 4.55386 18.7467 3.96785 17.9578C3.63852 17.5145 3.73094 16.8881 4.17428 16.5588ZM19.8257 16.5588C20.2691 16.8881 20.3615 17.5145 20.0321 17.9578C19.4461 18.7467 18.7467 19.4461 17.9578 20.0321C17.5145 20.3615 16.8881 20.2691 16.5588 19.8257C16.2294 19.3824 16.3219 18.756 16.7652 18.4267C17.397 17.9573 17.9573 17.397 18.4267 16.7652C18.756 16.3219 19.3824 16.2294 19.8257 16.5588ZM9.68958 20.7582C9.76995 20.2118 10.2781 19.834 10.8245 19.9144C11.2076 19.9707 11.6001 20 12 20C12.3999 20 12.7924 19.9707 13.1755 19.9144C13.7219 19.834 14.23 20.2118 14.3104 20.7582C14.3908 21.3046 14.013 21.8127 13.4666 21.8931C12.9874 21.9636 12.4976 22 12 22C11.5024 22 11.0126 21.9636 10.5334 21.8931C9.987 21.8127 9.6092 21.3046 9.68958 20.7582Z"></path>
                  <circle cx="12" cy="12" r="12" fill="#8E1F0B" style={{ display: "none" }}></circle>
                  <circle cx="12" cy="12" r="9" fill="#8E1F0B" stroke="#999EA4" strokeWidth="2" style={{ display: "none" }}></circle>
                  <text x="12" y="16" textAnchor="middle" fontSize="12" fontWeight="bold" fill="#8E1F0B"> 3 </text>
                </svg>

                <Text as="h3" variant="headingMd"> Activate Wishlist for Collections Pages </Text>
              </InlineStack>

              <Tooltip width="wide" content="Watch: How to Add a Heart Icon to Collection Pages">
                <Button onClick={handleWatchVideoClick} size="slim">
                  Preview: Add Heart Icon to Collection Pages
                </Button>
              </Tooltip>
            </InlineStack>
          
            <Text as="h5" variant="headingMd" fontWeight="regular">
              This will add the Wishlist to your store's collection pages. 
            </Text>
          </BlockStack>

          <BlockStack gap={200}>
            <Text as="h1" variant="headingMd" fontWeight="bold">
              Steps to Follow
            </Text>
            <BlockStack gap={100} as="li" align="center" inlineAlign="start">
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} Click on 'Add Wishlist Collections'
              </Text>
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} <strong>Wishlist Collections </strong> will be automatically added to App embeds
              </Text>
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} Check if 'Wishlist Collections' enabled or not, If not then just Enable it
              </Text>
              <Text as="span" variant="headingSm" fontWeight="regular">
                {`➺`} Save the changes
              </Text>
            </BlockStack>
          </BlockStack>

          <InlineStack>
            <Button variant="primary" url={appEmbedCollectionDeepLink} target="_blank" icon={ExternalSmallIcon}>
              Add Wishlist Collections 
            </Button>
          </InlineStack>

        </BlockStack>
      </Card>

      <Modal
        title="How to Add a Heart Icon to Collection Pages in your Online Store!"
        open={videoPreviewModal}
        onClose={handleVideoModalClose}
        size="large"
      >
        <Modal.Section>
          <BlockStack gap={400}>
            <Text as="h3" variant="headingMd" alignment="start" tone="critical">
              You can set up a Heart Icon to your store's collection pages according to this preview!
            </Text>
            <BlockStack gap={1000}>
              <video width="100%" height="auto" preload="auto" controls autoPlay muted>
                <source src={CollectionPages} type="video/mp4" />
                  Your browser does not support the video tag.
              </video>
              <Text as="h3" variant="headingMd" alignment="end" tone="magic">
                Wishlist-ProX
              </Text>
            </BlockStack>
          </BlockStack>
        </Modal.Section>
      </Modal>
    </>
  );
};
