
const axios = require('axios');

module.exports.microsoftAuth = async (accessToken) => {
  try {
    const data = await axios({
      method: 'GET',
      url:"https://graph.microsoft.com/v1.0/me",
      headers: {
        "Authorization": `Bearer ${accessToken}`
      }
  });
  const user = await data.data
  return user;
  } catch (err) {
    logger.error(null, '----- Error finding microsoft user -----:', err);
    throw err;
  }
}
