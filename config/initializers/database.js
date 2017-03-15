var fs        = require("fs");
var path      = require("path");
var Sequelize = require('sequelize');
var nconf = require('nconf');
var db        = {};

module.exports = function(cb) {
	'use strict';
	var modelsPath = __dirname + "/../../app/models/";
	
	nconf.env();
	var sequelize = new Sequelize('mysql://'+nconf.get('DB_USER')+':'+nconf.get('DB_PASS')+'@'+nconf.get('DB_HOST')+'/'+nconf.get('DB_DATABASE'), {timezone:'Europe/Paris'});
  	fs
	    .readdirSync(modelsPath)
	    .filter(function(file) {
	        return (file.indexOf(".") !== 0);
	    })
	    .forEach(function(file) {
	        var model = sequelize["import"](path.join(modelsPath, file));
	        db[model.name] = model;
	    });

	Object.keys(db).forEach(function(modelName) {
	    if ("associate" in db[modelName]) {
	        db[modelName].associate(db);
	    }
	});

	db.sequelize = sequelize;
	db.Sequelize = Sequelize;
	
	//SYNC ALL MODELS
	//AND FIX RELATIONS BUGS
	if(nconf.get('DB_FORCE_SYNC') === 'true'){
		sequelize.query('SET FOREIGN_KEY_CHECKS = 0')
		.then(function(){
		    return sequelize.sync({ force: true });
		})
		.then(function(){
		    return sequelize.query('SET FOREIGN_KEY_CHECKS = 1', { raw: true })
		})
		.then(function(){
		    console.log('Database synchronised.');
		}, function(err){
		    console.log(err);
		});
	}
	
	cb(null ,db);
};