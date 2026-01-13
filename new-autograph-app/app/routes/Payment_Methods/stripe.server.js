// To see your test secret API key embedded in code samples, sign in to your Stripe account.
// https://dashboard.stripe.com/test/apikeys.

import Stripe from "stripe";
const APPLICATION_URL = "https://delivery-profile-app.fly.dev"

// This is test secret API key.
// const STRIPE_SECRET_KEY = process.env.NODE_ENV === "production" ? process.env.STRIPE_SECRET_KEY_LIVE : process.env.STRIPE_SECRET_KEY_TEST;
const STRIPE_SECRET_KEY = process.env.NODE_ENV === "production" ? process.env.STRIPE_SECRET_KEY_TEST : process.env.STRIPE_SECRET_KEY_TEST;
console.log("=> stripe server - process.env.NODE_ENV :", process.env.NODE_ENV);
console.log("=> stripe server - STRIPE_SECRET_KEY :", STRIPE_SECRET_KEY);

const stripe = new Stripe(STRIPE_SECRET_KEY);
// console.log("stripe :", stripe);


// Endpoint on server that creates a PaymentIntent. A PaymentIntent tracks the customer’s payment 
// lifecycle, keeping track of any failed payment attempts and ensuring the customer is only charged 
// once. Return the PaymentIntent’s client secret in the response to finish the payment on the client.
export const createPaymentIntent = async (itemAmount, custStripeId, receiptEmail, metaData) => {
    console.log("===> Creating Payment Intent...");
    console.log(">>> itemAmount: ", itemAmount);
    console.log(">>> custStripeId: ", custStripeId);
    console.log(">>> receiptEmail: ", receiptEmail);
    console.log(">>> metaData: ", metaData);

    const parsedMetaData = typeof metaData === 'string' ? JSON.parse(metaData) : metaData;
    console.log("Parsed metaData:", parsedMetaData);

    try {
        // Create a PaymentIntent with the order amount and currency
        const paymentIntent = await stripe.paymentIntents.create({
            amount: itemAmount,
            currency: "usd",
            automatic_payment_methods: {
                enabled: true,
            },
            customer: custStripeId,
            receipt_email: receiptEmail,
            metadata: parsedMetaData,
        });
        // console.log("paymentIntent :", paymentIntent);
    
        return {
            // paymentIntent,
            clientSecret: paymentIntent.client_secret,
            // [DEV]: For demo purposes only, you should avoid exposing the PaymentIntent ID in the client-side code.
            dpmCheckerLink: `https://dashboard.stripe.com/settings/payment_methods/review?transaction_id=${paymentIntent.id}`,
        }
    } catch(error) {
        console.error("Error while creating payment intent", error);
    }
};



export const createCheckoutSession = async (request, response) => {
    console.log("=== createCheckoutSession ... === ");
    try {
        const session = await stripe.checkout.sessions.create({
            payment_method_types: ['card'],
            // ui_mode: 'embedded',
            line_items: [
                {
                    price: `{{pr_1234}}`, // Provide the exact Price ID (for example, pr_1234) of the product you want to sell
                    quantity: 1,
                },
            ],
            mode: 'payment',
            // return_url: `${YOUR_DOMAIN}/return?session_id={CHECKOUT_SESSION_ID}`,
            success_url: `${APPLICATION_URL}?success=true`,
            cancel_url: `${APPLICATION_URL}?canceled=true`,
        });

        response.redirect(303, session.url);

    } catch (error) {
        console.error(" Error while creating checkout session! ", error);
        // response.status(500).json({ error: 'Failed to create checkout session' });
    }
};



export const createTestCustomer = async (email, name) => {
    console.log("===> Creating New Customer...");
    console.log(">> with EMAIL: ", email);
    console.log(">> and with NAME: ", name);

    try {
        const createCustomer = await stripe.customers.create({
          email: email,
          name: name,
          description: `This email ${email} is used for payment`,
        });

        if(createCustomer) {
            console.log("Test customer created!");
            return createCustomer;
        } else {
            console.log("No customer Created with that email.");
            return null;
        }
    } catch (error) {
        console.error("Error creating customer:", error.message);
    }
};

export const getCustomerIdByEmail = async (email) => {
    console.log("===> Getting Customer Data using Emial...:", email);
    try {
        const getCustomers = await stripe.customers.list({
            email: email,
            limit: 5,
        });
        // console.log("getCustomers: ", getCustomers);
        if (getCustomers?.data?.length > 0) {
            const customerData = getCustomers.data[0];
            // console.log("Customer found:", customerData);
            return customerData;
        } else {
            console.log("No customer found with that email.");
            return null;
        }
    } catch (error) {
        console.error("Error retrieving customer:", error.message);
        throw error;
    }
};

export const customerTransactions = async (customerId) => {
    console.log("===> Fetching transactions for customer ID:", customerId);

    try {  
      const transactions = await stripe.charges.list({
        customer: customerId, 
        limit: 1,
      });
      if(transactions && transactions.data) {
          console.log("Customer transactions:", transactions.data);
          const latestTransaction = transactions.data[0];
          return latestTransaction;
      } else {
        return null;
      }
    } catch (error) {
      console.error("Error fetching transactions:", error);
      throw new Error("Unable to retrieve customer transactions");
    }
};