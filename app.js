var express = require('express');
var path = require('path');
// var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');

var corser = require('corser'); // 解决跨域问题

var mongoose = require('./config/mongoose.js');
var db = mongoose();

var routes = require('./routes/index');
var users = require('./routes/users');

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use('/files', express.static(path.join(__dirname, 'files')));

// CORS 解决跨域
app.use(corser.create({
    methods: corser.simpleMethods.concat(["PUT"]),
    requestHeaders: corser.simpleRequestHeaders.concat(["X-Requested-With"])
}));
app.all('*', function (request, response, next) {
    response.header('Access-Control-Allow-Headers', 'Content-Type,X-Requested-With,Authorization,Access-Control-Allow-Origin');
    response.header('Access-Control-Allow-Methods', 'POST,GET,DELETE');
    response.header('Access-Control-Allow-Origin', '*');
    next();
});

app.use('/', routes);
app.use('/users', users);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    var err = new Error('Not Found');
    err.status = 404;
    next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
    app.use(function (err, req, res, next) {
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: err
        });
    });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error', {
        message: err.message,
        error: {}
    });
});


module.exports = app;
