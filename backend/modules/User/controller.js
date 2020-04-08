const userService = require('../../services/user.service');

module.exports.login = async (req, res, next) => {
  try {
    const data = await userService.login(req.body);
    res.send(data);
  } catch (err) {
    next(err)
  }
}

module.exports.updateUser = async (req, res, next) => {
  try {
    const updatedUser = await userService.update(req.params.userId, req.body, req.user);
    res.send({message: 'Under construction update user.', user: updatedUser});
  } catch (err) {
    next(err)
  }
}

module.exports.getUsers = async (req, res, next) => {
  try {
    const users = await userService.findAll({email: 1, role: 1});
    res.send(users)
  } catch (err) {
    next(err);
  }
}

module.exports.deleteUser = async (req, res, next) => {
  try {
    const data = await userService.delete(req.params.userId, req.user)
    res.send(data);
  } catch (err) {
    next(err);
  }
}

module.exports.register = async (req, res, next) => {
  try {
    res.send({message: 'Register user under construction'});
  } catch (err) {
    next(err);
  }
}

module.exports.createUser = async (req, res, next) => {
  try {
    const data = await userService.create(req.body, req.user);
    res.send({newUser: data, success: true, message: `Successfully created a new user: ${data.email}`});
  } catch (err) {
    next(err);
  }
}

module.exports.auth = async (req, res, next) => {
  try {
    const data = await userService.auth(req.body)
    res.send(data);
  } catch (err) {
    next(err)
  }
}