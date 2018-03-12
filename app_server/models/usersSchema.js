var mongoose = require('mongoose');
var Schema = mongoose.Schema;
mongoose.Promise = global.Promise;

//setting the schema
var userScheme = new Schema({
    login: String,
    email: String,
    password: String
});
    
mongoose.model("users", userScheme);//create module with schema

