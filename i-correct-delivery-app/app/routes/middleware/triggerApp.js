
// routes/middleware/triggerApp.js

import { authenticate } from '../../shopify.server';

export const triggerApp = async (request, product) => {
    console.log('triggerApp middleware executed');
    // console.log('request:', request);
    console.log('product:', product);
    

    const { admin, session } = await authenticate.admin(request);
    console.log('triggerApp - admin:', admin);
    console.log('triggerApp - session:', session);

};
