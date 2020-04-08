const router = require('express').Router();
const userController = require('./controller');
const auth = require('../../middleware/auth.middleware')

router.post('/login', userController.login);
router.post('/', auth.checkClientToken, userController.createUser);
router.put('/:userId', auth.checkClientToken, userController.updateUser);
router.get('/', auth.checkClientToken, userController.getUsers);
router.delete('/:userId', auth.checkClientToken, userController.deleteUser);
router.post('/auth', userController.auth);

module.exports = router;