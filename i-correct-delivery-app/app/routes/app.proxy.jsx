import { authenticate } from "../shopify.server";
import { triggerApp } from "./middleware/triggerApp";

// export const loader = async ({ request }) => {
//     await authenticate.admin(request);
    
//     const { admin, session } = await authenticate.admin(request);
//     console.log('admin:', admin);
//     console.log('session:', session);

//     return null;
// };


export const action = async ({ request }) => {
  console.log("hit by app/proxy - action executed +++++++++++++++++++++++++++++++++++");
  // console.log("request:", request);

  // const { session } = await authenticate.public.appProxy(request);
  // console.log('session:', session);

  

  try {
    // Parse the incoming request
    const data = await request.json();
    // console.log("Received data:", data);

    const { product } = data;
    console.log('Product:', product);

    // Process the request (e.g., update assets, trigger some action)
    const trigger = await triggerApp(request, product);
    console.log("trigger:", trigger);


    return new Response(
      JSON.stringify({ success: true, message: "App triggered successfully!" }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    );
    
  } catch (error) {
    console.error("Error processing the request:", error);
    return new Response(
      JSON.stringify({ success: false, message: "Error triggering app" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      },
    );
  }
};
