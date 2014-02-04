var express         = require('express'),
	expressNamespace= require('express-namespace'),
	_ 				= require('underscore'),
	backbone 		= require('backbone'),
	consolidate 	= require('consolidate'),
	mongodb			= require('mongodb'),
	ws				= require('ws'),
//	less			= require('less'),
    path            = require('path'),
	fs 				= require('fs'),
	http 			= require('http'),
	config 			= require('./config.json');

var app             = express(),
	dirTemplates	= path.join(__dirname, '..', 'public', 'templates');



app.configure(function() {
    app.set('port', process.env.PORT || 1987);

	app.set('config', config);

	app.set('views', dirTemplates);


	app.engine('html', consolidate.underscore);
	app.set('view engine', 'html');

    app.use(express.logger('dev'));
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(express.cookieParser());
    app.use(express.session({secret: 'monkey'}));
    app.use(app.router);
});

var resourse = {
	script : function() {
		var script 		= app.get('config').script,
			collector 	= new String();

		for(var key in script) {
			collector += _.template(fs.readFileSync(path.join(dirTemplates, 'helpers', 'script.html'), 'utf8'), {
				src 	: script[key].src,
				type 	: script[key].type || 'text/javascript'
			});
		}

		return collector;
	}
}
app.set('resource', resourse);

//console.log('HERE', resourse.script());

// development only
if ('development' == app.get('env')) {
    app.use(express.errorHandler());
}
/*
app.get('/postit/config', function(req, res) {
    res.send(config.public);
});

require('./routes/views/admin')(app, config, passport);
require('./routes/api/articles')(app, config, db, query);
require('./routes/api/users')(app, config, db, query);
require('./routes/auth')(app, config, db, passport, TwitterStrategy);
 */



console.log(resourse.script());

require('./routes/views/client')(app);

http
	.createServer(app)
	.listen(app.get('port'), function() {
		console.log(path.join(__dirname, '..', 'public', 'less'));
	    console.log('Express server listening on port ' + app.get('port'));
	});