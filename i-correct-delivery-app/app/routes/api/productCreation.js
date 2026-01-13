
import { authenticate } from "../../shopify.server";

export const productCreation = async (request) => {
    const { admin, session } = await authenticate.admin(request);

    try {
        const product = new admin.rest.resources.Product({
            session: session
        });

        product.title = "Testing Product";
        product.body_html = "<strong>Testing API Product!</strong>";
        product.vendor = "Testing";
        product.product_type = "testing_product";
        product.status = "draft";

        await product.save({
            update: true,
        });
        // return productCreated;        
    } catch (error) {
        console.error('Error creating product:', error);
        throw new Error('Product creation failed');
    }
}
