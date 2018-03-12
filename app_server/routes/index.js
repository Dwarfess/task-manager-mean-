var express = require('express');
var router = express.Router();

var mainCtrl = require('../controllers/mainCtrl');


router.post('/api/auth', mainCtrl.login);//check user and login
router.post('/api/users', mainCtrl.addNewUser);//add new user

module.exports = router;
