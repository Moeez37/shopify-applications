
import { authenticate } from '../../shopify.server';

export const productCounts = async (request) => {
    const { admin, session } = await authenticate.admin(request);

    const totalProducts =  await admin.rest.resources.Product.count({
        session: session,
    });

    const count = totalProducts.count;
    
    return count;
}
