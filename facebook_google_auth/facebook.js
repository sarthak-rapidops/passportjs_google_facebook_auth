const queryString = require('query-string');
const axios = require('axios');

module.exports=async function getAccessTokenFromCodef(code) {
    const { data } = await axios({
      url: 'https://graph.facebook.com/v4.0/oauth/access_token',
      method: 'get',
      params: {
        client_id: "<your client id>",
        client_secret: "<your secret key>",
        redirect_uri: 'http://localhost:5000/users/facebook/',
        code,
      },
    });
    console.log(data); // { access_token, token_type, expires_in }
    return data.access_token;
  };

  module.exports=async function getFacebookUserData(access_token) {
    const { data } = await axios({
      url: 'https://graph.facebook.com/me',
      method: 'get',
      params: {
        fields: ['id', 'email', 'first_name', 'last_name'].join(','),
        access_token: accesstoken,
      },
    });
    console.log(data); // { id, email, first_name, last_name }
    return data;
  };
