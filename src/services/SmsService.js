export const sendSMS = async (message) => {
    console.log('Sending SMS');
    const apiUrl = 'https://e1dypr.api.infobip.com/sms/2/text/advanced';
    const authorizationToken = 'App ece5a5a8f136c21a74bf2657d89ef5dc-85888b0f-5329-4d8f-9c63-762c92741934';
  
    const postData = {
      messages: [
        {
          destinations: [
            {
              to: '27721371977',
            },
          ],
          from: 'InfoSMS',
          text: message,
        },
      ],
    };
  
    try {
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          Authorization: authorizationToken,
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify(postData),
      });
  
      const responseData = await response.json();
      console.log('HTTP status code:', response.status);
      console.log(responseData);
    } catch (error) {
      console.error(error);
    }
  };
  
 