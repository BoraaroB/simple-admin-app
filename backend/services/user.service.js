const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const isEmail = require('validator').isEmail
const error = require('../lib/error');
const models = require('../db').models;
const constants = require('../constants/constants');


console.log(isEmail)

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
 * @param {object} req http request object
 * @param {object} body body of the request
 * @param {object} options 
 * 
 * @return {object} user fresh logged user and token
 */
module.exports.login = async (req, options) => {
  try {
    console.log('aaaaaaaaaaaaaaa')
    if (!req.body.email) throw error('EMAIL_IS_REQUIRED');
    if (!req.body.password) throw error('PASSWORD_IS_REQUIRED');
    const { email, password } = req.body;
    let user = await models.user.findOneByFields({ email });
    console.log('aaaaaaaaaaaaaaa', user)
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
    console.error(`----- Error login user -----`, err)
    throw err;
  }
}


/**
 * create function that creates a new user
 * @param {object} req http request object
 * @param {object} options PASSWORD_IS_TO_SHORT
 * 
 * @return {object} newUser newly created user
 */
module.exports.create = async (req, options = {}) => {
  try {
    const { email, password, confirmPassword, role } = req.body;
    const { user } = req;

    const foundUser = await models.user.findOneByFields({ email }, options);
    if (foundUser) throw error('ALREADY_EXIST');

    _checkIsValidUserData(user, email, password, confirmPassword, role);
    req.body.password = _cryptPassword(password);
    const newUser = await models.user.create(req.body);
    console.log(`Successfully created a new user: ${newUser.email}`);
    return newUser;
  } catch (err) {
    console.error(`----- Error creating a new user -----`, err)
    throw err;
  }
};

/**
 * edit function that edit a user
 * @param {object} req http request object
 * @param {object} options 
 * 
 * @return {object} updated user
 */
module.exports.update = async (req, options = {}) => {
  try {
    if (!req.params.userId) throw error('MISSING_USER_ID');
    const user = await models.user.findById(req.params.userId);

    if (!user) throw error('NOT_FOUND');

    if (!(req.user.role >= constants.USER.ROLES.ADMIN) || !(req.user.role <= constants.USER.ROLES.MANAGER)) {
      throw error('NOT_ALLOWED');
    }
    if (req.user.role === constants.USER.ROLES.MANAGER) {
      if (req.body.role && (req.body.role !== user.role)) {
        throw error('NOT_ALLOWED');
      }
    }

    if (req.body.hasOwnProperty('role') && (req.body.role === 0 || constants.USER.ALL_ROLES.indexOf(req.body.role) === -1)) throw error('ROLE_BAD_FORMAT')
    req.body.modifiedAt = new Date();
    if(req.body.password) delete req.body.password;
    let updatedUser = await models.user.update(req.params.userId, req.body);
    updatedUser = JSON.parse(JSON.stringify(updatedUser));
    if (updatedUser && updatedUser.password) delete updatedUser.password;

    return updatedUser;
  } catch (err) {
    console.error(`----- Error edit user -----`, err);
    throw err;
  }
}

/**
 * delete function that delete user
 * @param {object} req http request object
 * 
 * @return {object} success object {success: true, message: `successfully deleted user: ${req.params.userId}`};
 */
module.exports.delete = async (req) => {
  try {
    if (!req.params.userId) throw error('MISSING_USER_ID');
    if (!req.user.role || req.user.role !== constants.USER.ROLES.ADMIN) throw error('NOT_ALLOWED');

    const deletedUser = await models.user.delete(req.params.userId);
    deletedUser ? console.log(`Successfully deleted user: ${req.params.userId}`) : console.log(`Not found user: ${req.params.userId}`)

    return { success: true, message: `successfully deleted user: ${req.params.userId}` };
  } catch (err) {
    console.error(`----- Error edit user -----`, err);
    throw err;
  }
}

/**
 * create function that creates a new user
 * @param {object} req http request object
 * 
 * @return {object} 
 */
module.exports.findAll = async (options = {}) => {
  try {
    const users = await models.user.findAll(options);
    console.log(`Successfully find all users`);
    return users;
  } catch (err) {
    console.error(`----- Error finding all users -----`);
    throw err
  }
}

/**
 * findUser function that find a user
 * @param {object} req http request object
 * 
 * @return {object} found user
 */
module.exports.findUser = async (req, body, options = {}) => {
  try {
    const user = await models.user.findById(req.user._id, options)
    console.log(`Successfully find user: `);
    return user;
  } catch (err) {
    console.error(`----- Error finding user -----: `, err);
  }
}