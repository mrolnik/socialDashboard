var dbSocial = require('../models/socialDB')

module.exports = function(app) {

	app.get('/', function (req, res) {
		console.log('cookies' in req);
		console.log('socialId' in req.cookies);
		console.log( req.session.userId);
		if('cookies' in req && 'socialId' in req.cookies && req.session.userId){
			//llamo a la base para agarrar los datos de
			dbSocial.getUser(req.session.userId, function(user) {
				if(user){
					res.render('index', {title: 'Bienvenido', user: user});
				}
				else
				{
					res.render('login', {error: 'Ocurrió un error inesperado', title: 'Inicia Sesión'});
				}
			});
		}
		else
		{
			req.cookies = {}

			if (req.session.userId) {
			 	req.session.userId = null;
			 	dbSocial.clearSession(req.session.userId);
			}

			res.render('login', {title: 'Inicia Sesión'});
		}
	});


	app.post('/', function(req, res) {
		//valida con mongo los datos del usuario
		//si estan correctos te manda a index
		//si son incorrectos te dice el error y te manda a login
		dbSocial.authenticateUser({
			user: req.param('user'),
			password: req.param('password') 
		},
		function(success, user) {
			if(success){
				req.session.userId = user.publicId;

				res.render('index', {title: 'Bienvenido', user: user});
			}
			else
			{
				res.render('login', {error: 'El usuario y/o la contraseña son incorrectos, intentelo nuevamente.', title: 'Inicia Sesión'});
			}
		}); 

	});

	app.get('/register', function(req, res) {
		res.redirect('/');
	});

	app.post('/register', function(req, res) {
		//valida con mongo los datos del usuario
		//si estan correctos te manda a index
		//si son incorrectos te dice el error y te manda a login
		var user = {
			user: req.param('user'),
			password: req.param('password'),
			email: req.param('email')
		};

		dbSocial.newUser(user,
		function(success, data) {
			if(success){
				req.session.userId = data; 
				res.render('index', {title: 'Bienvenido', user: user});
			}
			else
			{
				res.render('login', {error: data, title: 'Inicia Sesión'});
			}
		}); 

	});
};