const jwt = require('jsonwebtoken');
const models = require('../db/').models;
const error = require('../lib/error');

/**
 * 
 * @param {string} userId Id fo the user
 * 
 * @return {object} user object
 */
const _checkUser = async (userId) => {
  try {
    const user = await models.user.findById(userId, { email: 1, role: 1 });
    return user;
  } catch (err) {
    throw err;
  }

}

const Auth = {
  checkClientToken: function (req, res, next) {
    // check header or url parameters or post parameters for token
    const token = req.headers['x-access-token'];
    if (!token) return next(error('NOT_AUTHORIZED'));
    // verifies secret and checks exp
    jwt.verify(token, process.env.TOKEN_SECRET, async function (err, decoded) {
      if (err) {
        if (err.message == 'jwt expired') {
          console.error('----- Error Your session has been expired -----');
          return next(error('EXPIRED'));
        } else {
          return next(error('NOT_AUTHORIZED'));
        }
      }

      if (!decoded || !decoded.userId) {
        return next(error('NOT_AUTHORIZED'));
      }

      try {
        const user = await _checkUser(decoded.userId);
        if (!user) {
          return next(error('NOT_AUTHORIZED'));
        }
        
        req.user = user.toJSON();
        next();
      } catch (error) {
        console.error('----- Error auth middleware user: ----- ', error)
        next(error)
      }

    });
  }
};

module.exports = Auth;


