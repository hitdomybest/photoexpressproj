
var express = require('express');
var router = express.Router();

var formidable=require("formidable");

var fs=require("fs");
var path=require("path");
var db=require("../models/dbObj");

var photos=[];

var photoItem={
	   photo_name: "Node.js Logo",
	   photo_path: "http://nodejs.org/images/logos/nodejs-green.png"
};

photos.push(photoItem);

photoItem={
	   photo_name: "Ryan Speaking",
	   photo_path: "http://nodejs.org/images/ryan-speaker.jpg"
};

photos.push(photoItem);

photoItem={
     photo_name: "Image Test",
     photo_path: "/photos_dev/23.png"
};

photos.push(photoItem);

var pathForPhotos="";


function isFormData(req){
  var formType=req.headers["content-type"] || "";
  return formType.indexOf("multipart/form-data")==0;
}

function showPhotosList(db, res, next){
  var query = "SELECT * FROM photos " + 
              "ORDER BY id DESC";
  db.query(
            query,
            function(err, rows) {
                if (err){
                    return next(err);
                }    

                for (var i in rows){
                     var imgPath=rows[i]["photo_path"];
                     var index=imgPath.indexOf("\\public\\");
                     var startIndex=index+7;
                     imgPath=imgPath.substring(startIndex);
                     var imgFilePath=imgPath.replace(/\\/g,"/");
                     rows[i]["photo_path"]=imgFilePath;
                }

                res.render("photos",{
                                     title: "Photos",
                                     photos: rows
                });

            }

          );
}


module.exports=function(photosPath){
        this.photosPath=photosPath;
        
        pathForPhotos = this.photosPath;
        
        /*
        this.list=router.get('/', function(req, res, next) {
                              res.render("photos",{
                                     title: "Photos",
                                     photos: photos
                               });
                    });
        */
        
        this.list=router.get('/', function(req, res, next) {                              
                        showPhotosList(db, res, next);
                  });
         
        this.showUploadForm=router.get('/upload', function(req, res, next) {

                                        res.render("photos/upload",{title: "Upload photo images here"});
                    });

        this.uploadFile=router.post("/upload/doFileUpload", function(req, res, next){

                                    if (!isFormData(req)){
                                        res.statusCode=400;
                                        res.end("Bad Request: expecting multipart/form-data");
                                        return;
                                    }
     
                                    var form=new formidable.IncomingForm();

                                    form.uploadDir='tmp';

                                    form.on("progress", function(bytesReceived,bytesExpected){
                                                var percent=Math.floor((bytesReceived/bytesExpected) * 100);
                                                console.log(percent.toString()+"%");
                                           });

                                    form.parse(req, function(err, fields, files){

                                                var imageTitle=fields.photo_name;
                                                var sourceImageFilePath=files.photo_image.path;
                                                var imageFileName=files.photo_image.name;

                                                var destImageFilePath=path.join(pathForPhotos, imageFileName);

                                                fs.rename(sourceImageFilePath, destImageFilePath, function(err){
                                                        
                                                        if (err){
                                                            return next(err);
                                                        }

                                                        db.query("insert into photos(photo_name, photo_path) values (?,?)",[imageTitle,destImageFilePath],function(err){
                                                              if (err){
                                                                  return next(err);
                                                              }
                                                              
                                                              res.redirect("/");
                                                        });
                                                });


                                            });


                    });

        this.downloadImageFile=router.get("/photo/:id/download", function(req, res, next){
                     var imgId=req.params.id;
                     db.query("select * from photos where id = ? limit 1", [imgId], function(err, rows){
                              if (err){
                                  return next(err);
                              }

                              if (rows){
                                  var imgFilePath=rows[0]["photo_path"];
                                  //res.sendfile(imgFilePath);
                                  res.download(imgFilePath);
                              }
                     });
        });

};

