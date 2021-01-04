const express = require('express');
const {userById, allUsers, getUser, updateUser, deleteUser, userPhoto} = require('../controllers/user');
const {requireSignin} = require('../controllers/auth');


const router = express.Router();

router.get('/users', allUsers);
router.get('/user/:userId', requireSignin, getUser);
router.put('/user/:userId', requireSignin, updateUser);
router.get('/user/photo/:userId', userPhoto);
router.delete('/user/:userId', requireSignin, deleteUser);

//Any routers contatining :userId, our app will first execute userById()
router.param("userId", userById)

module.exports = router;

