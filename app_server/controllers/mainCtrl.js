var mongoose = require('mongoose');
var userModel = mongoose.model('users');

//ADD NEW USER
module.exports.addNewUser = function(req, res){
    //regular for checking login
    var regex = new RegExp(["^", req.body.login, "$"].join(""), "i");
    
    userModel.findOne({"login":regex}, function(err, doc){
        if(doc){
            console.log("Go error");
            res.send("Error");
        } else{
            var newUser = new userModel({
                login: req.body.login,
                email: req.body.email,
                password: req.body.pass
            });
            
            newUser.save(function(err){                
                if(err) return console.log(err);
                res.send("Object is saved");
                console.log("Object is saved", newUser.login);
            });    
        }
    });	
}

module.exports.login = function(req, res){
    //regular for checking login
    var regex = new RegExp(["^", req.body.login, "$"].join(""), "i");
    
    userModel.findOne({"login":regex}, function(err, doc){
        if(doc){
            if(doc.password == req.body.password){
                res.type('application/json');
                res.jsonp(doc);
            } else  {
                var resp = {status: 1};
                res.jsonp(resp);
                console.log("Wrong password");
            }
        } else{
            var resp = {status: 2};
            res.jsonp(resp);
            console.log("This user doesn't exist");
        }
    });
}

