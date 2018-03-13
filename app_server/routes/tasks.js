var express = require('express');
var router = express.Router();
var app = express();

var tasksCtrl = require('../controllers/tasksCtrl');

router.get('/api/tasks', tasksCtrl.getTasks);//get all the tasks
router.get('/api/reset', tasksCtrl.reset);//reset to default

router.post('/api/saveMoving', tasksCtrl.saveMoving);//save moving tasks 
router.post('/api/group', tasksCtrl.createGroup);//create new group
router.post('/api/task', tasksCtrl.createTask);//create new task

app.delete('/api/deleteGroup', tasksCtrl.deleteGroup);//delete the group

module.exports = router;
