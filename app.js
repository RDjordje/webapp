var express = require('express'),
    path = require('path'),
    favicon = require ('serve-favicon'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser');

var db = require('./model/db'),
    person = require('./model/persons');

var routes = require('./routes/index'),
    persons = require('./routes/persons');
var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.url)
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', routes);
app.use('/persons', persons);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error ('Not Found');
  err.status = 404;
  next(err);
});

if (app.get('env') === 'development'){
  app.use(function(err,req,next){
    res.status(err.status || 500);
    res.render('error',{
      message : err.message,
      error: err
    });
  });
}


// error handler
app.use(function(err, req, res, next) {
  res.status(err.status || 500);
  res.render('error',{
    message:err.message,
    error:{}
  });

});

module.exports = app;
