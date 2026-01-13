

export const getJobPricing = async (accessToken) => {
    console.log('IN getJobPricing');
    
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json; charset=utf-8");
    myHeaders.append("Authorization", `Bearer ${accessToken}`);

    var raw = JSON.stringify({
        "job": {
            "pickup_at": "2024-09-10T11:00:00.000+02:00",
            "pickups": [
                {
                    "address": "Senate House, Malet St, London WC1E 7HU, United Kingdom",
                    "comment": "Testing API",
                    "contact": {
                        "firstname": "Bobby",
                        "lastname": "Brown",
                        "phone": "+33610101010",
                        "email": "bobby.brown@pizzashop.com",
                        "company": "Pizza Shop"
                    }
                }
            ],
            "dropoffs": [
                {
                    "package_type": "medium",
                    "package_description": "yellow package",
                    "client_reference": "1640181124",
                    "address": "12 Margaret St, London W1W 8JQ, United Kingdom",
                    "comment": "Floor 0 Flitcoft House",
                    "contact": {
                        "firstname": "Julia",
                        "lastname": "Moore",
                        "phone": "+442070998517",
                        "email": "client3@email.com",
                        "company": "iCorrect"
                    }
                }
            ]
        }
    });

    var requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    // const getJobsUrl = "https://api.sandbox.stuart.com/v2/jobs/pricing";
    const getJobsUrl = "https://api.stuart.com/v2/jobs/pricing";
    
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






    // const response = await fetch(getJobsUrl, requestOptions)
    //     .then(response => response.text())
    //     .then(result => {
    //         console.log('result:', result)
    //     })
    //     .catch(error => console.log('error', error));
