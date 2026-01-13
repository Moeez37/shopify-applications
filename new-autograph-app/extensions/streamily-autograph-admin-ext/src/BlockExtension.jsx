import {
  reactExtension,
  AdminBlock,
  BlockStack,
  Text,
  Form,
  Select,
  InlineStack,
  useApi,
} from '@shopify/ui-extensions-react/admin';
import { useState, useEffect, useCallback } from 'react';
import { gql } from 'graphql-request';
import { createProduct } from './api/createProduct';
import { updateProduct } from './api/updateProduct';
import { publishProduct } from './api/publishProduct';
import { hideProduct } from './api/hideProduct';

const TARGET = 'admin.product-details.block.render';
const GRAPHQL_ENDPOINT = 'shopify:admin/api/graphql.json';


const METAFIELD_CREATE_MUTATION = gql`
  mutation MetafieldsSet($ownerId: ID!, $value: String!) {
    metafieldsSet ( 
      metafields: [
        {
          namespace: "custom"
          key: "add_autograph"
          type: "boolean"
          value: $value,
          ownerId: $ownerId,
        }
      ]
    ) {
      metafields {
        id
        namespace
        key
        value
      } 
      userErrors {
        field
        message
      }
    }
  }
`;

const METAFIELD_DELETE_MUTATION = gql`
  mutation MetafieldsDelete($id: ID!) {
    metafieldDelete(input: {id: $id}) {
      deletedId
      userErrors {
        field
        message
      }
    }
  }
`;

const METAFIELD_QUERY = gql`
  query GetProductMetafield($id: ID!) {
    product(id: $id) {
      metafield(namespace: "custom", key: "add_autograph") {
        id
        key 
        value
        namespace
      }
    }
  }
`;


const MONEY_METAFIELD_CREATE_MUTATION = gql`
  mutation MetafieldsSet($ownerId: ID!, $value: String!) {
    metafieldsSet ( 
      metafields: [
        {
          namespace: "custom"
          key: "add_autograph_price"
          type: "money"
          value: $value,
          ownerId: $ownerId,
        }
      ]
    ) {
      metafields {
        id
        namespace
        key
        value
      }
      userErrors {
        field
        message
      }
    }
  }
`;

const MONEY_METAFIELD_QUERY = gql`
  query GetProductMetafield($id: ID!) {
    product(id: $id) {
      metafield(namespace: "custom", key: "add_autograph_price") {
        id
        key 
        value
        namespace
      }
    }
  }
`;

const GET_AUTOGRAPH_PRODUCT_QUERY = gql`
  query {
    productByHandle(handle: "autograph-gift-wrap-handle") {
      id
      handle
      title
      status
      variants(first: 20) {
        edges {
          node {
            id
            title
            displayName
            price
          }
        }
      }
      publishedAt
    }
  }
`;



export default reactExtension(TARGET, () => <App />);

function App() {
  // const extensionApi = useExtensionApi();
  const extensionApi = useApi();
  const [currentProductId, setCurrentProductId] = useState(null);  
  const [displayMetafieldId, setDisplayMetafieldId] = useState(null);
  const [moneyMetafieldId, setMoneyMetafieldId] = useState(null);
  const [dropDownValue, setDropDownValue] = useState('');

  const autographProductHandle = "autograph-gift-wrap-handle";


  useEffect(() => {
    const rawProductId = extensionApi?.productDetails?.id || extensionApi?.data?.selected?.[0]?.id;
    const productId = rawProductId ? rawProductId.replace('gid://shopify/Product/', '') : null;
    if (productId && productId !== currentProductId) {
      setCurrentProductId(productId);
    }
  }, [extensionApi, currentProductId]);
  
  useEffect(() => {
    if (currentProductId) {
      getDisplayMetafield(currentProductId);
      getMoneyMetafield(currentProductId);
      getAutographProduct();
    }
  }, [currentProductId]);



  const getAutographProduct = async () => {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({ query: GET_AUTOGRAPH_PRODUCT_QUERY }),
      });
      const result = await response.json();      
      const productData = result.data.productByHandle;
      console.log('productData 11 :', productData);

      if(productData) {
        await updateProduct(productData);
        await hideProduct(productData);
      } else {
        await createProduct(autographProductHandle);
      }

      const _productId = productData?.id;
      const _publishedAt = productData?.publishedAt;
      if( (!_publishedAt) && _productId) {
        await publishProduct(_productId);
      }

    } catch (error) {
      console.error('Error retrieving autograph product:', error);
    }
  };


  const getDisplayMetafield = async (productId) => {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          query: METAFIELD_QUERY,
          variables: { 
            id: `gid://shopify/Product/${productId}` 
          },
        }),
      });
      const result = await response.json();      
      const metafield = result.data?.product?.metafield;
      // console.log('display metafield:', metafield);
      if (metafield) {
        setDisplayMetafieldId(metafield.id);
      }
    } catch (error) {
      console.error('Error retrieving metafield:', error);
    }
  };

  const createDisplayMetafield = async (value, ownerIdHere) => {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: METAFIELD_CREATE_MUTATION,
          variables: {
            ownerId: `gid://shopify/Product/${ownerIdHere}`,
            value: value.toString(),
          },
        }),
      });
      const result = await response.json();
      if (response.ok && result.data.metafieldsSet.userErrors.length === 0) {
        console.log(
          '%c Autograph attached to Product!', 
          'font-size:16px; color: white; background: linear-gradient(90deg, #8da5e0, #88c9b8, #b2dfd4); padding: 4px; border-radius: 4px;',
        );
        
        getDisplayMetafield(currentProductId);
      } else {
        console.error('Error creating metafield:', result.data.metafieldsSet.userErrors);
      }
    } catch (error) {
      console.error('Error executing GraphQL mutation:', error);
    }
  };

  const deleteDisplayMetafield = async (display_metafieldId) => {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: METAFIELD_DELETE_MUTATION,
          variables: { id: display_metafieldId },
        }),
      });
      const result = await response.json();
      if (response.ok && result.data.metafieldDelete.userErrors.length === 0) {
        console.log(
          '%c Streamly Autograph Reset!', 
          'font-size:16px; color: white; background: linear-gradient(90deg, #cc33ff, #cc99ff, #9999ff, #ccccff, #8da5e0); padding: 4px; border-radius: 4px;',
        );
        setDisplayMetafieldId(null);
      } else {
        console.error('Error deleting metafield:', result.data.metafieldDelete.userErrors);
      }
    } catch (error) {
      console.error('Error executing GraphQL mutation:', error);
    }
  };


  const getMoneyMetafield = async (productId) => {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        body: JSON.stringify({
          query: MONEY_METAFIELD_QUERY,
          variables: { 
            id: `gid://shopify/Product/${productId}` 
          },
        }),
      });
      const result = await response.json();      
      const moneyMetafield = result.data?.product?.metafield;
      if (moneyMetafield) {
        // console.log('Money metafield OK!');
        const parsedValue = JSON.parse(moneyMetafield.value);
        const metafieldValue = parseFloat(parsedValue.amount);
        if(metafieldValue == '0'){
          setDropDownValue('10');
        } else {
          setDropDownValue(metafieldValue);
        }

        setMoneyMetafieldId(moneyMetafield.id);
      }
    } catch (error) {
      console.error('Error retrieving metafield:', error);
    }
  };

  const createMoneyMetafield = async (value, ownerIdHere) => {

    // Map selected value to a price (in cents) and currency code (e.g., USD)
    const priceMap = {
      10: { amount: 0, currency: "USD" }, // $00.00
      50: { amount: 50, currency: "USD" }, // $50.00
      70: { amount: 70, currency: "USD" }, // $70.00
      100: { amount: 100, currency: "USD" }, // $100.00
    };

    const selectedPrice = priceMap[value];
    const moneyValue = JSON.stringify({
      amount: selectedPrice.amount,
      currency_code: selectedPrice.currency,
    });

    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          query: MONEY_METAFIELD_CREATE_MUTATION,
          variables: {
            ownerId: `gid://shopify/Product/${ownerIdHere}`,
            value: moneyValue.toString(),
          },
        }),
      });
      const result = await response.json();
      if (response.ok && result.data.metafieldsSet.userErrors.length === 0) {
        const realValue = JSON.parse(moneyValue);
        const dollar = realValue.amount;
        console.log(
          `%c $${dollar} Autographed Available for Product!`,
          'font-size:16px; color: white; background: linear-gradient(45deg, red, #ff9933, orange, #71ad9f, #9999ff, blue, indigo, violet, #88c9b8, green, #b2dfd4); padding: 4px; border-radius: 4px;'
        );

        getMoneyMetafield(currentProductId);
      } else {
        console.error( "Error creating money metafield:",
          result.data.metafieldsSet.userErrors,
        );
      }
    } catch (error) {
      console.error("Error executing GraphQL mutation:", error);
    }
  };

  const deleteMoneyMetafield = async (money_metafieldId) => {
    try {
      const response = await fetch(GRAPHQL_ENDPOINT, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: METAFIELD_DELETE_MUTATION,
          variables: { id: money_metafieldId },
        }),
      });
      const result = await response.json();
      if (response.ok && result.data.metafieldDelete.userErrors.length === 0) {
        // console.log('Money Metafield deleted!');
        setMoneyMetafieldId(null);
      } else {
        console.error('Error deleting money metafield:', result.data.metafieldDelete.userErrors);
      }
    } catch (error) {
      console.error('Error executing GraphQL mutation:', error);
    }
  };


  const handleSelectChange = useCallback(async (value) => {
    // console.log("handleSelectChange - value :", value);

    setDropDownValue(value);

    if (value == '99999') {
      await deleteMoneyMetafield(moneyMetafieldId);
      await deleteDisplayMetafield(displayMetafieldId);
    } else {
      await createMoneyMetafield(value, currentProductId);
      if (!displayMetafieldId) {
        await createDisplayMetafield(true, currentProductId);
      }
    }

  }, [currentProductId, moneyMetafieldId, displayMetafieldId, dropDownValue]);


  const _AutographOptions = [
    {
      value: "99999",
      label: "Select Autograph",
    },
    {
      value: "10",
      label: "Christ $0",
    },
    {
      value: "50",
      label: "John $50",
    },
    {
      value: "70",
      label: "Emily $70",
    },
    {
      value: "100",
      label: "Steven $100",
    },
  ];


  return (
    <AdminBlock title="Streamily Autographs">
      <BlockStack paddingInlineEnd={"large"}>
        <Text fontWeight="bold">Welcome to Streamily Autographs</Text>
        <Text fontStyle="italic">Choose Autograph from below options to add with Product !</Text>

        {(!displayMetafieldId || !dropDownValue || dropDownValue == '99999') && (
          <Form id="autographForm" onSubmit={() => {}}>
            <InlineStack gap padding="true" inlineAlignment="center">
              <Select
                placeholder="Select Signature for this product"
                value={dropDownValue}
                onChange={handleSelectChange}
                options={_AutographOptions}
              />
            </InlineStack>
          </Form>
        )}

        {(displayMetafieldId && dropDownValue && dropDownValue != '99999' ) && (
          <Form id="autographForm" onSubmit={() => {}}>
            <InlineStack gap padding="true" inlineAlignment="center">
              <Select
                placeholder="Select Signature for this product"
                value={dropDownValue}
                onChange={handleSelectChange}
                options={_AutographOptions}
              />
            </InlineStack>
          </Form>
        )}

      </BlockStack>
    </AdminBlock>
  );
}
