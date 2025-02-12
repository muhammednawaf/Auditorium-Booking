var createError = require('http-errors');
var express = require('express');
var hbs = require('express-handlebars');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
var db = require('./config/connection');
const session = require("express-session");




// In your app.js or server.js



db.connect((err)=>{
  if(err){
    console.log("error "+err);
  }
  else{
    console.log("database connected to 27017");
  }

})

var indexRouter = require('./routes/index');
var adminRouter = require('./routes/admin');


var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'hbs');
app.engine('hbs', hbs.engine(
  {
    extname: 'hbs',
    defaultLayout: 'layout',
    layoutsDir: path.join(__dirname, '/views/layout/'),
    partialsDir: path.join(__dirname, '/views/partials/')

  }));



app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.use("/uploads", express.static(path.join(__dirname,"uploads")));
app.use(session({
  secret: process.env.SESSION_SECRET, // Secret key to sign the session ID cookie
  resave: false,             // Don't force a session to be saved back to the store
  saveUninitialized: true,   // Save a session that is uninitialized
  cookie: {
    maxAge: 24 * 60 * 60 * 1000, // Session expiry time (1 day in milliseconds)
    secure: false,             // Set to true if using HTTPS (ensure secure cookies)
  }
}));



app.use('/', indexRouter);
app.use('/admin', adminRouter);



// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

module.exports = app;
