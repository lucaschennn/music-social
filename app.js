var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
const { auth, requiresAuth } = require('express-openid-connect');
var logger = require('morgan');

var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
//var loginRouter = require('./routes/login.js')

var app = express();

const config = {
    authRequired: false,
    auth0Logout: true,
    baseURL: 'http://localhost:3000',
    clientID: 'fgAVMUxa4fOuVJrvNnHDEvA9NO5Bqviz',
    issuerBaseURL: 'https://dev-6i1pfi2p.us.auth0.com',
    secret: 'LONG_RANDOM_STRING'
  };

app.use(auth(config));

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/users', usersRouter);
//app.use('/login', loginRouter)

module.exports = app;
