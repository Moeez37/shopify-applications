
export const createWebhook = async (accessToken) => {
    console.log('IN createWebhook');

    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    var raw = JSON.stringify({
        "url": "https://webhook.site/89a9b726-7fd1-4cf9-a9af-08d904a01255",
        "version": "v3",
        "topics": [
            "package_created"
        ],
        "enabled": true,
        // "authentication_header": "Authorization",
        // "authentication_key": `Bearer ${accessToken}`,
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    // const getJobsUrl = "https://api.sandbox.stuart.com/v2/jobs/pricing";
    const getJobsUrl = "https://api.stuart.com/v2/webhooks";

    try {
        const response = await fetch(getJobsUrl, requestOptions);

        if (!response.ok) {
            const errorDetail = await response.json();
            console.error('Error details:', errorDetail);
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();

        return result;
    } catch (error) {
        console.error('Error occurred:', error);
        throw error;
    }
}


