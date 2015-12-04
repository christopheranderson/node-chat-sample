var express = require('express'),
    socketIO = require('socket.io'),
    path = require('path'),
    favicon = require('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    http = require('http');

var session = require("express-session")({
      secret: process.env['session_secret'] || "my-secret",
      resave: true,
      saveUninitialized: true
    }),
    ioSession = require("express-socket.io-session");
// Express Routes
var routes = require('./routes/index');
var chat = require('./routes/chat');
var user = require('./lib/user');
var faq = require('./routes/faq');
var getstarted = require('./routes/getstarted');
var supportportal = require('./routes/supportportal');
var about = require('./routes/about');
var feedback = require('./routes/feedback');

// IO Namespaces
var chatIO = require('./lib/chat-io');

var app = express();
var server = http.createServer(app);
var io = socketIO(server);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(session);

// Express Route init
// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(path.join(__dirname, 'bower_components')));

// Middleware
app.use(function(req, res, next) {
  console.log(req.session);
  res.locals.user = req.session.user;
  next();
});

// Unauthenticated
app.use('/', routes);
app.use('/login', user.login);

// Authenticated
app.use(user.requireAuth);
app.use('/logout', user.logout);
app.use('/chat', chat);
app.use('/faq',faq);
app.use('/get-started',getstarted);
app.use('/portal', supportportal);
app.use('/about', about);
app.use('/feedback', feedback);

// IO Namespace init
chatIO(io.of('/chat').use(ioSession(session)));

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function(err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
      message: err.message,
      error: err
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error', {
    message: err.message,
    error: {}
  });
});


module.exports = {app: app, server: server};
