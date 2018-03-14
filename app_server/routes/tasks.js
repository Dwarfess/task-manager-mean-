var express = require('express');
var router = express.Router();
var app = express();

var tasksCtrl = require('../controllers/tasksCtrl');

router.get('/api/tasks', tasksCtrl.getTasks);//get all the tasks
router.get('/api/reset', tasksCtrl.reset);//reset to default

router.post('/api/saveMoving', tasksCtrl.saveMoving);//save moving tasks 
router.post('/api/group', tasksCtrl.createGroup);//create new group
router.post('/api/task', tasksCtrl.createTask);//create new task

router.delete('/api/deleteGroup', tasksCtrl.deleteGroup);//delete the group
router.delete('/api/deleteTask', tasksCtrl.deleteTask);//delete the task

router.put('/api/update', tasksCtrl.update);//update the task



module.exports = router;
