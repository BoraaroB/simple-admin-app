const router = require('express').Router();
const userController = require('./controller');

router.post('/login', userController.login);
router.post('/create', userController.createUser);
router.put('/:userId', userController.updateUser);
router.get('/', userController.getUsers);
router.delete('/:userId', userController.deleteUser);

module.exports = router;