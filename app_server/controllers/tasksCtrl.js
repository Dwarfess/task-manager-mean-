var fs = require("fs");

var mongoose = require('mongoose');
var userModel = mongoose.model('users');
var tasksModel = mongoose.model('tasks');

//function receives and adds the array with tasks to mongo
async function list(file){
    var obj = file; 
    console.log("Start list");
    for(var i=0;i<obj.length;i++){
        let newTask = new tasksModel(obj[i]);

        await newTask.save(function(err){
            if(err) return console.log(err);
        });
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
    
    await tasksModel.remove({}, function (err) {
        if (err) return handleError(err);
    });
        
    await list(req.body);//function receives and adds the array with tasks to mongo
            
    tasksModel.find({}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc);
    });     
};

    //RESET TO DEFAULT
module.exports.reset = async function(req, res){ 

    await tasksModel.remove({}, function (err) {
        if (err) return handleError(err);
    });
    
    let file = JSON.parse(fs.readFileSync('public/tasks.json', 'utf8'));
    await list(file);//function receives and adds the array with tasks to mongo
    
    tasksModel.find({}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc); 
    });      
};


    //CREATE NEW GROUP
module.exports.createGroup = async function(req, res){
    var newGroup = new tasksModel({title:req.body.title});       
    await newGroup.save(function(err){                
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
        }}},{upsert: true},function(err, doc) {
            if(err) return console.log(err);
            console.log("New task was saved", req.body.name);
        });
    
    tasksModel.find({}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc); 
    });
};	



    //DELETE THE GROUP
module.exports.deleteGroup = function(req, res){
    let parse_url = url.parse(req.url).query;
    let id = qs.parse(parse_url).id;
    
    mongoose.connect(db_path, options);
    //find the task by id and delete
    tasksModel.remove({"_id":id}, function(err, doc){
        console.log("The group was deleted");
    });
    
    tasksModel.find({}, function(err, doc){
        res.type('application/json');
        res.jsonp(doc); 
    });
  
};

//    //DELETE THE TASK FROM THE GROUP
//app.delete('/api/deleteTask', function(req, res){
//    let parse_url = url.parse(req.url).query;
//    let id = qs.parse(parse_url).id;
//    
//    mongoose.connect(db_path, options);
//    tasksModel.update({},{$pull:{"tasks":{"_id":id}}},{multi:true}, function(err, doc){
//        console.log("The task was deleted"); 
//    });
//    
//    tasksModel.find({}, function(err, doc){
//        res.type('application/json');
//        res.jsonp(doc); 
//    });
//});
//
//    //UPDATE TASK
//app.put('/api/update', function(req, res){
//    mongoose.connect(db_path, options);
//
//    tasksModel.updateOne({"tasks._id": req.body._id},
//                         { $set: { "tasks.$.name":req.body.name,
//                                   "tasks.$.due_date":req.body.due_date,
//                                   "tasks.$.description":req.body.description
//                                 }}, function(err,doc){
//        console.log("That task was update");
//    });
//    
//    tasksModel.find({}, function(err, doc){
//        res.type('application/json');
//        res.jsonp(doc); 
//    });
//});