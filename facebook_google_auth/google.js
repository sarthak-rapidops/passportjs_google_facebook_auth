const queryString = require('query-string');

// GET ACCESS TOKEN
module.exports=async function getAccessTokenFromCode(code) {
    const { data } = await axios({
      url: `https://oauth2.googleapis.com/token`,
      method: 'post',
      data: {
        client_id: " <your client id>",
        client_secret: "<your secret id>",
        redirect_uri: 'http://localhost:5000/users/google',
        grant_type: 'authorization_code',
        code,
      },
    });
    console.log(data); // { access_token, expires_in, token_type, refresh_token }
    return data.access_token;
  };

//   GET FILES
module.exports=async function getGoogleDriveFiles(access_token) {
    const { data } = await axios({
      url: 'https://www.googleapis.com/oauth2/v2/userinfo',
      method: 'get',
      headers: {
        Authorization: `Bearer ${accesstoken}`,
      },
    });
    console.log(data); // { id, email, given_name, family_name }
    return data;
  };
