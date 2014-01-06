var db = require('mongodb').Db;
var server = require('mongodb').Server;

var dPort = 27017;
var dHost = 'localhost';
var dName = 'socialDashboard';

var socialDB = {};

var mapUsers = {};

socialDB.db = new db(dName, new server(dHost, dPort, {auto_reconnect: true}, {}));

socialDB.db.open(function(e,d) {
	if(e){
		console.log(e);
	}else{
		console.log('Conectado a la base de datos: ' + dName);
	}
});

socialDB.users = socialDB.db.collection('users');

socialDB.authenticateUser = function(user, callback) {
	var that = this;
	socialDB.users.findOne({userName: user.name}, function(e, o) {
		var u = null;
		
		if(o && o.password == user.password){
			var pId = new Date().getTime(); 
			console.log(o._id);
			mapUsers[pId] = that.getObjectId(o._id);
			u = {
				user : o.user,
				publicId : pId
			};
		}
		callback(o && o.password == user.password, u);
	});
};
socialDB.getUser = function(pId, callback) {
	if(pId in mapUsers){
		socialDB.users.findOne({_id: mapUsers[pId]}, function(e, o) {
			var u = null;
			if(o){
				u = {
					user : o.user
				};

				callback(u);
			}
			else{
				callback(false);
			}
		});
	}else{
		callback(false);
	}
};

socialDB.newUser = function(newData, callback) {
	var that = this;
	socialDB.users.findOne({email: newData.email}, function(e, o) {
		if(o){
			callback(false, 'El email ya existe!');
		}else{
			socialDB.users.findOne({user: newData.user}, function(e, o) {
				if(o){
					callback(false, 'El usuario ya existe!');
				}else{
					socialDB.users.insert(newData, function(e, o) {
						var pId = new Date().getTime(); 
						mapUsers[pId] = that.getObjectId(o[0]._id);
						callback(true, pId);
					});
				}
			});
		}
	});
};

socialDB.clearSession = function(pId) {
	delete mapUsers[pId];
};

// users.list =  function(callback) {
// 	users.subscriptors.find().toArray(function(e, res) {
// 		if(e){
// 			callback(e);
// 		}else{
// 			callback(null, res);
// 		}
// 	});
// };

// users.edit = function(newData, callback) {
// 	users.subscriptors.findOne({_id: this.getObjectId(newData.id) }, function(e, o) {
// 		o.name = newData.name;
// 		o.email = newData.email;
// 		users.subscriptors.save(o);
// 		callback(o);
// 	});
// };

// users.delete = function(id, callback) {
// 	users.subscriptors.remove({_id: this.getObjectId(id) }, callback);
// };

socialDB.getObjectId = function(id) {

	return socialDB.users.db.bson_serializer.ObjectID.createFromHexString(id.toString());
};

module.exports = socialDB;
