var express = require('express');
var router = express.Router();

var tasksCtrl = require('../controllers/tasksCtrl');

router.get('/api/tasks', tasksCtrl.getTasks);//get all the tasks
router.get('/api/reset', tasksCtrl.reset);//reset to default 

router.post('/api/saveMoving', tasksCtrl.saveMoving);//save moving tasks


module.exports = router;
