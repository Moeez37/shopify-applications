
import prisma from "../../../db.server";

export const validateStuartAccessToken = async (request) => {

    const getAccessToken = await loadAccessTokenFromDatabase();
    if (getAccessToken) {
        const accessToken = getAccessToken.token;
        const expiresAt = new Date(getAccessToken.expiresAt).getTime();
        const currentDate = Date.now();

        if (currentDate < expiresAt) {
            console.log('Using cached access token.');
            return accessToken;
        } else {
            console.log('Access Token Expired.');
        }
    } else {
        console.log('No Access Token Found.');
    }

    // Token is expired or not present, generate a new one && save to DB
    const newToken = await generateNewToken();

    return newToken.access_token;
};


const loadAccessTokenFromDatabase = async () => {
    const tokenRecord = await prisma.accessToken.findUnique({
        where: { id: 1 }
    });

    return tokenRecord ? tokenRecord : null;
};


const generateNewToken = async () => {
    const tokenUrl = 'https://api.stuart.com/oauth/token';
    const clientId = process.env.STUART_CLIENT_ID;
    const clientSecret = process.env.STUART_CLIENT_SECRET;

    try {
        var myHeaders = new Headers();
        myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

        var urlencoded = new URLSearchParams();
        urlencoded.append("client_id", clientId);
        urlencoded.append("client_secret", clientSecret);
        urlencoded.append("grant_type", "client_credentials");
        urlencoded.append("scope", "api");

        var requestOptions = {
            method: 'POST',
            headers: myHeaders,
            body: urlencoded,
            redirect: 'follow'
        };

        const response = await fetch(tokenUrl, requestOptions);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const generatedToken = await response.json();
        await saveAccessTokenToDatabase(generatedToken);

        return generatedToken;
    } catch (error) {
        console.error('Error fetching Stuart access token:', error);
        throw new Error('Failed to get Stuart access token');
    }
}


const saveAccessTokenToDatabase = async (generatedToken) => {
    const { access_token, token_type, expires_in, created_at } = generatedToken;

    const expiresAt = new Date((created_at + expires_in) * 1000);
    const createdAt = new Date(created_at * 1000);
    const updatedAt = new Date();

    try {
        await prisma.accessToken.upsert({
            where: { id: 1 },
            update: {
                token: access_token,
                token_type: token_type,
                expiresAt: expiresAt,
                createdAt: createdAt,
                updatedAt: updatedAt,
            },
            create: {
                token: access_token,
                token_type: token_type,
                expiresAt: expiresAt,
                createdAt: createdAt,
                updatedAt: updatedAt,
            }
        });
        // await prisma.accessToken.create({
        //   data: {
        //     token: access_token,
        //     token_type: token_type,
        //     expiresAt: expiresAt,
        //     createdAt: createdAt,
        //     updatedAt: new Date(),
        //   },
        // });
        console.log('Access token saved successfully!');
    } catch (error) {
        console.log('Error while saving access token to db', error);
    }
}

