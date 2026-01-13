import { authenticate } from "../../shopify.server";

export const publishProduct = async (request, productId) => {
    console.log('Autograph Product is publishing...');
    // console.log("productId :", productId);

    const { admin } = await authenticate.admin(request);

    const getProductResponse = await admin.graphql(
    `#graphql
        query getPublications($id: ID!){
            product(id: $id) {
                # publishedOnCurrentPublication
                onlineStoreUrl
                publishedAt
            }
        }`,
        {
            variables: {
                "id": `${productId}`,
            },
        },
    );
    const getProductData = await getProductResponse.json();
    const _isPublished = getProductData.data.product.publishedAt;
    const _onlineStoreUrl = getProductData.data.product.onlineStoreUrl;
    if(_isPublished && _onlineStoreUrl) { 
        console.log("Product already published. Skipping...");
        return;
    }

    const getPublicationResponse = await admin.graphql(
    `#graphql
        query getPublications{
            publications(first: 10){
                edges {
                    node {
                        id
                        name
                    }
                }
            }

        }
    `);
    const getPublicationData = await getPublicationResponse.json();    
    const { publications } = getPublicationData.data;
    // console.log("publications :", publications);

    const publicationIds = publications.edges.map(({ node }) => ({
        publicationId: node.id,
    }));
    // console.log("publicationIds :", publicationIds);

    const publishProductResponse = await admin.graphql(
        `#graphql
        mutation publishProductToOnlineStore($id: ID!, $input: [PublicationInput!]!) {
            publishablePublish(id: $id, input: $input) {
                publishable {
                    # publishedOnCurrentPublication
                    availablePublicationsCount {
                        count
                    }
                    resourcePublicationsCount {
                        count
                    }
                }
                shop {
                    id
                    name
                    publicationCount
                }
                userErrors {
                    field
                    message
                }
            }
        }`,
        {
            variables: {
                "id": `${productId}`,
                "input": publicationIds,
            },
        },
    );
    const publishProductData = await publishProductResponse.json();
    const  { publishablePublish } = publishProductData.data;
    // const publishedOnCurrentPublication = publishablePublish.publishable.publishedOnCurrentPublication;
    const publishedOnCurrentPublication = publishablePublish.shop.id;

    return publishedOnCurrentPublication;
}
