import { DateTime } from "luxon";
import { authenticate } from "../../shopify.server";

export const autographOrder = async (request, productId, timeStampForOrders, ianaTimezone) => {
  const { admin } = await authenticate.admin(request);
  console.log("===> Getting Autograph Orders... ");

  const getStartOfCurrentWeek = () => {
    console.log("Calculating Start of Current Week for Orders...");
    const now = new Date();
    const dayOfAWeek = now.getDay();
    const diffToMonday = (dayOfAWeek === 0 ? 6 : dayOfAWeek - 1); 
    now.setDate(now.getDate() - diffToMonday);
    now.setHours(0, 0, 0, 0);
    return now.toISOString();
  };

  // Function to adjust date and time based on timezone
  const adjustDateForTimezone = (date, timezone) => {
    const dateTimeInTimezone = DateTime.fromISO(date, { zone: timezone });  
    // return dateTimeInTimezone.toUTC().toISO();
    return dateTimeInTimezone.toISO();
  };


  console.log("timeStampForOrders :", timeStampForOrders);

  let startDate = new Date();
  let endDate = new Date();

  // Use the timestamp if provided, otherwise default to the start of the week
  if(timeStampForOrders) {
    const startDate_fixedDateTime = new Date(timeStampForOrders * 1000).toISOString();
    const endDate_currentDateTime  = new Date().toISOString();
    // console.log("startDate_fixedDateTime 11 :", startDate_fixedDateTime);
    // console.log("endDate_currentDateTime 11 :", endDate_currentDateTime);

    startDate = startDate_fixedDateTime;
    endDate = endDate_currentDateTime;
  } else {
    startDate = getStartOfCurrentWeek();
    endDate = new Date().toISOString();
  }

  // console.log("startDate --- ", startDate);
  // console.log("endDate --- ", endDate);
  // console.log("ianaTimezone :", ianaTimezone);
  
  // Adjust both dates for the given timezone and convert them to UTC
  // const endDateAdjusted = adjustDateForTimezone(endDate, ianaTimezone);

  const startDateAdjusted = startDate;
  const endDateAdjusted = endDate;
  console.log(">>> start Date  :", startDateAdjusted);
  console.log(">>> end Date :", endDateAdjusted);


  try {
    const fetchOrders = async (cursor = null) => {
      const response = await admin.graphql(`
          query autographOrders($cursor: String) {
            # orders(first: 20, after: $cursor, query: "created_at:>'2024-12-19T15:58:40Z'") {
            orders(first: 20, after: $cursor, query: "created_at:>'${startDateAdjusted}'") {
            # orders(first: 20, after: $cursor, query: "created_at:>='${startDateAdjusted}' created_at:<'${endDateAdjusted}'") {
              edges {
                node {
                  id
                  name
                  createdAt
                  updatedAt
                  confirmed
                  fulfillable
                  displayFulfillmentStatus
                  subtotalLineItemsQuantity
                  currentTotalPriceSet {
                    shopMoney {
                      amount
                      currencyCode
                    }
                  }
                  fullyPaid
                  lineItems(first: 20) {
                    nodes {
                      id
                      name
                      quantity
                      product {
                        id
                        title
                      }
                      originalTotalSet {
                        shopMoney {
                          amount
                          currencyCode
                        }
                      }
                    }
                  }
                }
              }
              pageInfo {
                hasNextPage
                endCursor
              }
            }
          }`,
        {
          variables: {
            cursor,
          },
        },
      );

      const { data, errors } = await response.json();
      // console.log("data :", data);
      // console.log("data :", data.orders.edges);

      if (errors) {
        throw new Error( `GraphQL Error: ${errors.map((e) => e.message).join(", ")}`);
      }
      
      return data.orders;
    };

    // Fetch all orders with pagination
    let allOrders = [];
    let cursor = null;
    let hasNextPage = true;

    while (hasNextPage && allOrders?.length < 60 ) {
      const ordersData = await fetchOrders(cursor);
      // console.log('ordersData ;', ordersData);
      
      allOrders = [...allOrders, ...ordersData.edges];
      // console.log('allOrders ;', allOrders);
      
      hasNextPage = ordersData.pageInfo.hasNextPage;
      cursor = ordersData.pageInfo.endCursor;

      if (allOrders?.length >= 60) {
        allOrders = allOrders.slice(0, 60);
        break;
      }
    }

    let autographOrdersTotal = 0;

    // Filter orders that contain the 'streamily-autograph' product
    const ordersWithAutograph = allOrders?.filter((order) => {
      const matchedLineItems = order?.node?.lineItems?.nodes?.filter((lineItem) => {
        if (lineItem?.product?.id === productId) {
          const amount = parseFloat(lineItem?.originalTotalSet?.shopMoney?.amount);
          autographOrdersTotal += amount;
          return true;
        }
        return false;
      });

      return matchedLineItems?.length > 0;
    });

    // console.log("ordersWithAutograph ", ordersWithAutograph);
    // console.log("autographOrdersTotal :", autographOrdersTotal);
    
    let autographOrdersCount = ordersWithAutograph?.length;
    // console.log("autographOrdersCount :", autographOrdersCount);

    return {
      ordersWithAutograph,
      autographOrdersCount,
      autographOrdersTotal,
    };
  } catch (error) {
    console.error("Failed to fetch Autograph Orders:", error);
  }
};
