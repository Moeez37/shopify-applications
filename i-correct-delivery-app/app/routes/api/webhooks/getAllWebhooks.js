

export const getAllWebhooks = async (accessToken) => {
    console.log('IN getAllWebhooks');
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    var requestOptions = {
        method: 'GET',
        headers: myHeaders,
        redirect: 'follow'
    };

    // const getJobsUrl = "https://api.sandbox.stuart.com/v2/jobs/pricing";
    const getJobsUrl = "https://api.stuart.com/v2/webhooks/";
    
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


