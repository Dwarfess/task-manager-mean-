var mongoose = require('mongoose');
var dbURI = 'mongodb://localhost/dnd';

var options = {
    useMongoClient: true,
    autoIndex: false, // Don't build indexes
    reconnectTries: Number.MAX_VALUE, // Never stop trying to reconnect
    reconnectInterval: 500, // Reconnect every 500ms
    poolSize: 10, // Maintain up to 10 socket connections
    // If not connected, return errors immediately rather than waiting for reconnect
    bufferMaxEntries: 0
};

mongoose.connect(dbURI, options);

mongoose.connection.on('connected', function() {
	console.log('Mongoose connected to ' + dbURI);
});

mongoose.connection.on('error', function(err) {
	console.log('Mongoose connection error: ' + err);
});

mongoose.connection.on('disconnected', function() {
	console.log('Mongoose disconnected');
});

process.once('SIGUSR2', function() {
	gracefulShutdown('nodemon restart', function() {
		process.kill(process.pid, 'SIGUSR2');
	});
});

process.on('SIGINT', function() {
	gracefulShutdown('app termination', function() {
		process.exit(0);
	});
});

process.on('SIGTERM', function() {
	gracefulShutdown('app shutdown', function() {
		process.exit(0);
	});
});

var gracefulShutdown = function(msg, callback) {
	mongoose.connection.close(function() {
		console.log('Mongoose disconnected through ' + msg);
		callback();
	});
};

require('./usersSchema');
require('./tasksSchema');

