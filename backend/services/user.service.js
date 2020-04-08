const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isEmail = require('validator').isEmail
const error = require('../lib/error');
const logger = require('../lib/logger');
const models = require('../db').models;
const constants = require('../constants/constants');
const microsoftAuth = require('../middleware/microsoftAuth.middleware').microsoftAuth


const _cryptPassword = (password) => {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

const _validatePassword = (password, hash) => {
  return bcrypt.compareSync(password, hash);
};


const _generateToken = (user) => {
  const token = jwt.sign({
    email: user.email,
    userId: user._id
  }, process.env.TOKEN_SECRET, {
    expiresIn: 3600 * 24 // expires in 1 hour/
  });
  return token;
}

const _checkIsValidUserData = (user, email, password, confirmPassword, role) => {

  if (parseInt(user.role) !== constants.USER.ROLES.ADMIN) throw error('NOT_ALLOWED');

  if (!email) throw error('EMAIL_IS_REQUIRED');
  if (!isEmail(email)) throw error('EMAIL_IS_NOT_VALID')
  if (!password) throw error('PASSWORD_IS_REQUIRED');
  if (password.trim().length < 6) throw error('PASSWORD_IS_TO_SHORT');
  if (!confirmPassword) throw error('PASSWORD_IS_REQUIRED');
  if (!role) throw error('ROLE_IS_REQUIRED');

  if (password !== confirmPassword) throw error('PASSWORDS_DO_NOT_MATCH');
  return;

}

/**
 * login function that login a user
 * @param {object} body body of the request
 * 
 * @return {object} user fresh logged user and token
 */
module.exports.login = async (body) => {
  try {
    const { email, password } = body;
    if (!email) throw error('EMAIL_IS_REQUIRED');
    if (!password) throw error('PASSWORD_IS_REQUIRED');

    let user = await models.user.findOneByFields({ email });
    if (!user) throw error('NOT_FOUND');

    if (!_validatePassword(password, user.password)) throw error('INVALID_PASSWORD')
    user = user.toJSON();
    if (user.password) delete user.password;
    const token = _generateToken(user)
    return {
      user,
      token
    }
  } catch (err) {
    logger.error(null, `----- Error login user -----`, err)
    throw err;
  }
}


/**
 * create function that creates a new user
 * @param {object} body body object of hte request
 * @param {object} userData user that is logged in
 * @param {object} options 
 * 
 * @return {object} newUser newly created user
 */
module.exports.create = async (body, userData, options = {}) => {
  try {
    const { email, password, confirmPassword, role } = body;

    const foundUser = await models.user.findOneByFields({ email }, options);
    if (foundUser) throw error('ALREADY_EXIST');

    _checkIsValidUserData(userData, email, password, confirmPassword, role);
    body.password = _cryptPassword(password);
    let newUser = await models.user.create(body);
    logger.info(null, `Successfully created a new user: ${newUser.email}`);
    newUser = JSON.parse(JSON.stringify(newUser));
    if (newUser && newUser.password) delete newUser.password;
    return newUser;
  } catch (err) {
    logger.error(null, `----- Error creating a new user -----`, err)
    throw err;
  }
};

/**
 * edit function that edit a user
 * @param {string} userId id of the user who we are updating
 * @param {object} body body of the request
 * @param {object} userData logged in user data
 * @param {object} options 
 * 
 * @return {object} updated user
 */
module.exports.update = async (userId, body, userData, options = {}) => {
  try {
    if (!userId) throw error('MISSING_USER_ID');
    if (body.hasOwnProperty('role') && (body.role === 0 || constants.USER.ALL_ROLES.indexOf(body.role) === -1)) throw error('ROLE_BAD_FORMAT')

    const user = await models.user.findById(userId);

    if (!user) throw error('NOT_FOUND');

    if (userData.role > constants.USER.ROLES.MANAGER) throw error('NOT_ALLOWED');
    
    if (userData.role === constants.USER.ROLES.MANAGER) {
      //Manager can't change admin user role
      if (user.role === constants.USER.ROLES.ADMIN) throw error('NOT_ALLOWED');
      //Manager can't set user to admin
      if (body.role < constants.USER.ROLES.MANAGER) throw error('NOT_ALLOWED');
      
    }

    body.modifiedAt = new Date();
    if (body.password) delete body.password;
    let updatedUser = await models.user.update(userId, body);
    updatedUser = JSON.parse(JSON.stringify(updatedUser));
    if (updatedUser && updatedUser.password) delete updatedUser.password;

    return updatedUser;
  } catch (err) {
    logger.error(null, `----- Error edit user -----`, err);
    throw err;
  }
}

/**
 * delete function that delete user
 * @param {string} userId id of the user that we want ot delete
 * @param {object} user user who is logged in
 * @return {object} success object {success: true, message: `successfully deleted user: ${userId}`};
 */
module.exports.delete = async (userId, user) => {
  try {
    logger.info(null, 'This is user: ', user);
    if (!userId) throw error('MISSING_USER_ID');
    if (!user.role || user.role !== constants.USER.ROLES.ADMIN) throw error('NOT_ALLOWED');

    const deletedUser = await models.user.delete(userId);
    deletedUser ? logger.info(null, `Successfully deleted user: ${userId}`) : logger.info(null, `Not found user: ${userId}`)

    return { success: true, message: `successfully deleted user: ${userId}` };
  } catch (err) {
    logger.error(null, `----- Error edit user -----`, err);
    throw err;
  }
}

/**
 * findAll returns all users
 * @param {object} options 
 * 
 * @return {Array} an array of users 
 */
module.exports.findAll = async (options = {}) => {
  try {
    const users = await models.user.findAll(options);
    logger.info(null, `Successfully find all users`);
    return users;
  } catch (err) {
    logger.error(null, `----- Error finding all users -----`);
    throw err
  }
}

/**
 * findUser function that find a user
 * @param {string} userId user id that we are looking for
 * 
 * @return {object} found user
 */
module.exports.findUser = async (userId, options = {}) => {
  try {
    const user = await models.user.findById(userId, options)
    logger.info(null, `Successfully find user: `);
    return user;
  } catch (err) {
    logger.error(null, `----- Error finding user -----: `, err);
    throw err;
  }
}

/**
 * auth with microsoft account account
 * @param {object} body request body with all data from microsoft including access token
 * 
 * @return {object} user fresh logged user and token
 */
module.exports.auth = async (body) => {
  try {
    const microsoftUser = await microsoftAuth(body.accessToken);
    if (microsoftUser) {
      const user = await models.user.findOneByFields({email: microsoftUser.userPrincipalName}, {email: 1, role: 1})
      if(!user) {
        const newUser = await models.user.create({email: microsoftUser.userPrincipalName, role: constants.USER.ROLES.USER});
        const token = _generateToken(newUser);
        logger.info(`Successfully logged microsoft user`)
        return { user: newUser, token }
      } else {
        const token = _generateToken(user);
        return { user, token }
      }
    }
  } catch (err) {
    logger.error(null, '----- Error login using microsoft account -----', err);
    throw err;
  }
}