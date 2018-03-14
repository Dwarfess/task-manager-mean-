var fs = require("fs");
var url = require('url');
var qs = require("querystring");

var mongoose = require('mongoose');
var tasksModel = mongoose.model('tasks');

//function receives and adds the array with tasks to mongo
async function list(file){
    var obj = file; 
    console.log("Start list");
    for(var i=0;i<obj.length;i++){
        let newTask = new tasksModel(obj[i]);

        await (newTask.save(function(err){
            if(err) return console.log(err);
        }));
    }
}

    //GET ALL TASKS
module.exports.getTasks = function(req, res){      
    tasksModel.find({}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc);
    });      
};

    //SAVE MOVING TASKS
module.exports.saveMoving = async function(req, res){ 
    
    await tasksModel.remove({}, async function (err) {
        if (err) return handleError(err);
    });
        
    await (list(req.body));//function receives and adds the array with tasks to mongo
            
    tasksModel.find({}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc);
    });     
};

    //RESET TO DEFAULT
module.exports.reset = async function(req, res){ 

    await tasksModel.remove({}, async function (err) {
        if (err) return handleError(err);
    });
    
    let file = JSON.parse(fs.readFileSync('public/tasks.json', 'utf8'));
    await (list(file));//function receives and adds the array with tasks to mongo
    
    tasksModel.find({}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc); 
    });      
};


    //CREATE NEW GROUP
module.exports.createGroup = async function(req, res){
    var newGroup = new tasksModel({title:req.body.title});       
    await newGroup.save(async function(err){                
        if(err) return console.log(err);
        console.log("New group was saved", req.body.title);
    });
    
    tasksModel.find({}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc); 
    });
};	


    //ADD NEW TASK
module.exports.createTask = async function(req, res){
    
    await tasksModel.findOneAndUpdate({"_id": req.body.group._id},
        {$push: {"tasks": {
            name: req.body.name,
            due_date: req.body.due_date,
            description: req.body.description
        }}},{upsert: true},async function(err, doc) {
            if(err) return console.log(err);
            console.log("New task was saved", req.body.name);
        });
    
    tasksModel.find({}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc); 
    });
};	



    //DELETE THE GROUP
module.exports.deleteGroup = async function(req, res){
    let parse_url = url.parse(req.url).query;
    let id = qs.parse(parse_url).id;

    //find the task by id and delete
    await tasksModel.remove({"_id":id}, async function(err, doc){
        console.log("The group was deleted");
    });
    
    tasksModel.find({}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc); 
    });
  
};

    //DELETE THE TASK FROM THE GROUP
module.exports.deleteTask = async function(req, res){
    let parse_url = url.parse(req.url).query;
    let id = qs.parse(parse_url).id;

    await tasksModel.update({},{$pull:{"tasks":{"_id":id}}},{multi:true}, async function(err, doc){
        console.log("The task was deleted"); 
    });
    
    tasksModel.find({}, function(err, doc){
        console.log(`************* return`);
        res.type('application/json');
        res.jsonp(doc); 
    });
};

    //UPDATE TASK
module.exports.update = async function(req, res){
    
    await tasksModel.updateOne({"tasks._id": req.body._id},
                         { $set: { "tasks.$.name":req.body.name,
                                   "tasks.$.due_date":req.body.due_date,
                                   "tasks.$.description":req.body.description
                                 }}, async function(err,doc){
        console.log(`That task was updated ${req.body.name}`);
    });
    
    tasksModel.find({}, function(err, doc){
        console.log(`************* return update ${req.body.name}`);
        res.type('application/json');
        res.jsonp(doc); 
    });
};