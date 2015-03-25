// auth_server.js

// modules =================================================
var express = require('express');
var app = express();
var bodyParser = require('body-parser');
var cookieParser = require('cookie-parser');
var mongoose = require('mongoose');
var expressSession = require('express-session');
var mongoStore = require('connect-mongo')({session: expressSession});

// configuration ===========================================

// config files
var db = require('./config/db');

// set our port
var port = process.env.PORT || 8080;

// connect to our mongoDB database
mongoose.connect(db.url);

// schemas
require('./models/users_model.js');

app.engine('.html', require('ejs').__express);
app.set('views', __dirname + '/views');
app.set('view engine', 'html');
app.use(bodyParser.urlencoded({
	extended : true
}));
app.use(bodyParser.json());
app.use(cookieParser());

app.use(expressSession({
	secret : 'SECRET',
	cookie : {
		maxAge : 60 * 60 * 1000
	},
	store : new mongoStore({
		mongooseConnection: mongoose.connection,
		collection : 'users'
	})
}));

require('./routes')(app);

// start
console.log('Listening on port ' + port);
app.listen(port);
