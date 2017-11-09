
var express = require('express');
var router = express.Router();

var photos=[];

var photoItem={
	   name: "Node.js Logo",
	   path: "http://nodejs.org/images/logos/nodejs-green.png"
};

photos.push(photoItem);

photoItem={
	   name: "Ryan Speaking",
	   path: "http://nodejs.org/images/ryan-speaker.jpg"
};

photos.push(photoItem);

var currentEnvLable="2233";

/*
exports.list=function(req, res){
	
	res.render("photos",{
                   title: "Photos",
                   photos: photos
	});
}

exports.showUploadForm=function(req,res){
	res.end("show upload form");
}
*/

exports.list=router.get('/', function(req, res, next) {
    res.render("photos",{
                           title: "Photos",
                           photos: photos
	});
});

exports.showUploadForm=router.get('/upload', function(req, res, next) {
    //res.end("show upload form");
    
    res.render("photos/upload",{title: "Upload photo images here"});
    
});


exports.uploadFile=router.post("/upload/doFileUpload", function(req, res, next){
    var requestMethod=req.method;
    var requestUrl=req.url;
    res.end("Request method: "+requestMethod+"   Request url: "+requestUrl+ "    Current Environment: "+ currentEnvLable);
});


/*
exports.uploadFile=function(){
	router.post("/upload/doFileUpload", function(req, res, next){
           var requestMethod=req.method;
           var requestUrl=req.url;
           res.end("Request method: "+requestMethod+"   Request url: "+requestUrl);
    });
}
*/