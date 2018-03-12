var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

//setting the schema
var tasksScheme = new Schema({
    title: String,
    tasks: [{
        name: String,
        due_date: { type: Date, default: Date.now },
        description: String
    }]
});
    
mongoose.model("tasks", tasksScheme);//create module with schema
