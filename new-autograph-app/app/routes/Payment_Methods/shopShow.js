import { authenticate } from "../../shopify.server";
import { gql } from "graphql-request";

const GET_SHOP_RESOURCES_QUERY = gql`
    query ShopShow {
        shop {
            id
            url
            myshopifyDomain
            name 
            description
            currencyCode
            email
            contactEmail
            createdAt
            updatedAt
            customerAccounts
            billingAddress {
                phone
                company
                zip
                address1
                address2
                city
                province
                country
                countryCodeV2
            }
            timezoneAbbreviation
            ianaTimezone
            checkoutApiSupported
        }
    }
`;

// export async function shopShow(request) {
export const shopShow = async (request) => {
    const { admin } = await authenticate.admin(request);
    console.log("===> GETTING SHOP SHOW...");
    try {
        const response = await admin.graphql(GET_SHOP_RESOURCES_QUERY);
        const data = await response.json();
        const { shop } = data?.data;
        // console.log("shopShow - shop :", shop);
        return shop;
    } catch(error) {
        console.error("Error while getting Shop resources", error);
    }
}
