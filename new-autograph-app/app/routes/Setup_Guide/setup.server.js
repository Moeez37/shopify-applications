import { authenticate } from "../../shopify.server";
import { gql } from "graphql-request";

const GET_PRODUCTS_QUERY = gql`
    query ProductList {
        products(first: 10, query: "status:ACTIVE", sortKey: UPDATED_AT) {
            nodes {
                id
                handle
                title
                createdAt
                updatedAt
                metafield(namespace:"custom", key:"streamly_autograph_input_field" ) {
                    namespace
                    key
                }
            }
        }
    }
`;

const GET_THEMES_QUERY = gql`
    query ThemeList {
        themes(first: 20) {
            edges {
                node {
                    id
                    name
                    role
                    themeStoreId
                    createdAt
                    updatedAt
                }
                cursor
            }
            pageInfo {
                hasNextPage
                hasPreviousPage
            }
        }
    }
`;

const GET_THEME_FILE_QUERY = gql`
    query ThemeFiles($themeId: ID!, $filenames: [String!]!) {
        theme(id: $themeId) {
            files(filenames: $filenames) {
                nodes {
                    body {
                        ... on OnlineStoreThemeFileBodyBase64 { contentBase64 }
                        ... on OnlineStoreThemeFileBodyText { content }
                        ... on OnlineStoreThemeFileBodyUrl { url }
                    }
                    checksumMd5
                    contentType
                    createdAt
                    filename
                    size
                    updatedAt
                }
                userErrors {
                    code
                    filename
                }
            }
        }
    }
`;



export async function metafieldProducts(request) {
    const { admin } = await authenticate.admin(request);
    console.log('===> Getting PRODUCTS DATA...');

    const response = await admin.graphql(GET_PRODUCTS_QUERY);
    const responseJson = await response.json();
    const { nodes: productsData } = responseJson?.data?.products;
    // console.log(' productsData: ', productsData);
    const matchedMetaProduct = productsData?.find(singleNode => singleNode?.metafield);
    return matchedMetaProduct ? matchedMetaProduct : productsData[0];
}



export async function getThemes(request) {
    const { admin } = await authenticate.admin(request);
    console.log("Getting THEMES list...");

    const responseGetThemes = await admin.graphql(GET_THEMES_QUERY);
    const responseJson = await responseGetThemes.json();
    const { edges: themesData } = responseJson?.data?.themes;
    const mainTheme  = themesData.find(theme => theme?.node?.role === 'MAIN');
    // console.log("mainTheme :", mainTheme);
    
    let themeAsset = null;
    if(mainTheme && mainTheme?.node?.id) {
        console.log("Getting theme files...");

        const ThemeFileVariable = {
            variables: {
                "themeId": mainTheme.node.id,
                "filenames": [ "templates/product.json" ]
            },
        }
        
        const responseGetThemeAsset = await admin.graphql(GET_THEME_FILE_QUERY, ThemeFileVariable);
        const data = await responseGetThemeAsset.json();
        const { nodes: themeAssetsData } = data?.data?.theme?.files;
        // console.log("themeAssetsData :", themeAssetsData);
        themeAsset = themeAssetsData
    }
    
    return {
        mainTheme,
        themeAsset,
    }
};




