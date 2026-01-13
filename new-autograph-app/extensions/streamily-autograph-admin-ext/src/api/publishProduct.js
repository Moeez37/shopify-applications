
export const publishProduct = async (productId) => {

    const GRAPHQL_ENDPOINT = 'shopify:admin/api/graphql.json';

    const getPublicationsQuery = `
        query getPublications {
            publications(first: 10) {
                edges {
                    node {
                        id
                        name
                    }
                }
            }
        }
    `;

    const publishProductMutation = `
        mutation publishProductToOnlineStore($id: ID!, $input: [PublicationInput!]!) {
            publishablePublish(id: $id, input: $input) {
                publishable {
                    availablePublicationsCount {
                        count
                    }
                    resourcePublicationsCount {
                        count
                    }
                }
                userErrors {
                    field
                    message
                }
            }
        }
    `;



    // Get the publication IDs (Online Store and autograph-app)
    const getPublicationResponse = await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
            query: getPublicationsQuery,
        })
    });

    const getPublicationData = await getPublicationResponse.json();
    const { publications } = getPublicationData.data;

    const publicationIds = publications.edges.map(({ node }) => ({
        publicationId: node.id,
    }));

    await fetch(GRAPHQL_ENDPOINT, {
        method: 'POST',
        body: JSON.stringify({
            query: publishProductMutation,
            variables: {
                id: productId,
                input: publicationIds,
            },
        })
    });

    console.log(" BE - Sales Channels OK! ");
}
