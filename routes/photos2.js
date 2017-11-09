

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

var pathForPhotos="";


module.exports=function(photosPath){
        this.photosPath=photosPath;
        
        pathForPhotos = this.photosPath;

        this.list=function(req, res, next) {
                              if (req.url=="/"){
                                  res.render("photos",{
                                       title: "Photos",
                                       photos: photos
                                   });
                              } else if (req.url=="/upload"){
                                   res.render("photos/upload",{title: "Upload photo images here"});
                               } else if (req.url=="/upload/doFileUpload"){
                                    var requestMethod=req.method;
                                    var requestUrl=req.url;
                                    res.end("Request method: "+requestMethod+"   Request url: "+requestUrl+ "    Current Photos Path: "+ pathForPhotos+ "  Name in request body: "+req.body.photo_name);
                                } else {
                                     var err=new Error("Not Found");
                                     return next(err);
                                }
                              
                           };
        
        /*
        this.showUploadForm=function(req, res, next) {
                               if (req.url=="/upload"){
                                   res.render("photos/upload",{title: "Upload photo images here"});
                               } else {
                                   next();
                               }
                                        
                           };

        this.uploadFile=function(req, res, next){
                                if (req.url=="/upload/doFileUpload"){
                                    var requestMethod=req.method;
                                    var requestUrl=req.url;
                                    res.end("Request method: "+requestMethod+"   Request url: "+requestUrl+ "    Current Photos Path: "+ pathForPhotos);
                                } else {
                                     next();
                                }
                                    
                          };
        */
};


/*
module.exports=function(photosPath){
        this.photosPath=photosPath;
        
        pathForPhotos = this.photosPath;

        this.showUploadForm=function(req, res, next) {
                               if (req.url=="/upload"){
                                   res.render("photos/upload",{title: "Upload photo images here"});
                               } else {
                                   next();
                               }
                               return;         
                           };

        this.uploadFile=function(req, res, next){
                                if (req.url=="/upload/doFileUpload"){
                                    var requestMethod=req.method;
                                    var requestUrl=req.url;
                                    res.end("Request method: "+requestMethod+"   Request url: "+requestUrl+ "    Current Photos Path: "+ pathForPhotos+ "  Name in request body: "+req.body.photo_name);
                                } else {
                                     next();
                                }
                                return;     
                          };

        this.list=function(req, res, next) {
                              if (req.url=="/"){
                                  res.render("photos",{
                                       title: "Photos",
                                       photos: photos
                                   });
                              } else if (req.url=="/upload"){
                                   this.showUploadForm;
                               } else if (req.url=="/upload/doFileUpload"){
                                   this.uploadFile;
                                } else {
                                     var err=new Error("Not Found");
                                     return next(err);
                                }
                              
                           };
                              

};
*/

