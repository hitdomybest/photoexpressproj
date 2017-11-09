var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');


var app = express();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

var index = require('./routes/index');
var users = require('./routes/users');

//var mysql=require("mysql");
var db=require("./models/dbObj");

var port=3090;
app.set("port", port);

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

function envConfig(envLable){
	if (envLable=="development"){
    	app.set("photos", path.join(__dirname, 'public/photos_dev'));
    } else if (envLable=="production"){
    	app.set("photos", path.join(__dirname , 'public/photos_prod'));
    }
    return;
}

var currentEnvLable=process.env.NODE_ENV || "development";


//app.configure(process.env.NODE_ENV, envConfig);
app.configure(currentEnvLable, envConfig); //app.configure defined by yanglin in express.js file.

var photosObj=require('./routes/photos1');

var photos=new photosObj(app.get("photos"));

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));

app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));


app.use('/', photos.list);
//app.use('/', index);

/*
app.use('/users', users);
*/

app.use("/upload", photos.showUploadForm);
app.use("/upload/doFileUpload", photos.uploadFile);

app.use("/photo/:id/download", photos.downloadImageFile);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
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

//module.exports = app;

var http=require("http");
var httpServer=http.createServer(app);

var sqlStatement = "CREATE TABLE IF NOT EXISTS photos (" 
                 + "id INT(10) NOT NULL AUTO_INCREMENT, " 
                 + "photo_name varchar(100) DEFAULT '', " 
                 + "photo_path varchar(500) DEFAULT '', " 
                 + "PRIMARY KEY(id))";

db.query(sqlStatement, function(err){
      if (err){
      	  throw err;
      }
      
      httpServer.listen(app.get("port"), function(){
                 console.log("Current environment: "+currentEnvLable);
                 console.log("Path for photos: "+app.get("photos"));
                 console.log("This http server based on express is listening on port "+app.get("port"));
      });

});

