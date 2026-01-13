import { json } from "@remix-run/node";
import { Link, Outlet, useLoaderData, useRouteError } from "@remix-run/react";
import { boundary } from "@shopify/shopify-app-remix/server";
import { AppProvider } from "@shopify/shopify-app-remix/react";
import { NavMenu } from "@shopify/app-bridge-react";
import polarisStyles from "@shopify/polaris/build/esm/styles.css?url";
import { authenticate } from "../shopify.server";
import { AutographOrdersCostProvider } from "../context/AutographOrdersCostProvider";
import { AutographDateRangeProvider } from "../context/AutographDateRangeProvider";
import { autographProduct } from "./Dashboard/autographProduct";
import { AutographProductDataProvider } from "../context/AutographProductDataProvider";
// import { autographOrder } from "./Dashboard/autographOrder";

export const links = () => [{ rel: "stylesheet", href: polarisStyles }];

export const loader = async ({ request }) => {
  await authenticate.admin(request);
  const AutographProductData = await autographProduct(request);

  return json({ 
    apiKey: process.env.SHOPIFY_API_KEY || "",
    AutographProductData,
   });
};

export default function App() {
  const { apiKey, AutographProductData } = useLoaderData();

  return (
    <AppProvider isEmbeddedApp apiKey={apiKey}>
      <AutographProductDataProvider initialData={AutographProductData}>
        <AutographOrdersCostProvider>
          <AutographDateRangeProvider>
            <NavMenu>
              <Link to="/app" rel="home">
                Home
              </Link>
              {/* <Link to="/app/dashboard">Dashboard</Link> */}
              <Link to="/app/setup">Setup</Link>
              <Link to="/app/payment">Payments</Link>
              <Link to="/app/support">Support</Link>
              {/* <Link to="/app/additional">Additional page</Link> */}
            </NavMenu>
            <Outlet />
          </AutographDateRangeProvider>
        </AutographOrdersCostProvider>
      </AutographProductDataProvider>
    </AppProvider>
  );
}

// Shopify needs Remix to catch some thrown responses, so that their headers are included in the response.
export function ErrorBoundary() {
  return boundary.error(useRouteError());
}

export const headers = (headersArgs) => {
  return boundary.headers(headersArgs);
};
