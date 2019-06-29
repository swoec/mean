'use strict';

var validator = require('validator'),
  path = require('path'),
  config = require(path.resolve('./config/config'));
var fs = require('fs'),
  multer = require('multer'),
  util = require('util');

/**
 * Render the main application page
 */
exports.renderIndex = function (req, res) {
  var safeUserObject = null;
  if (req.user) {
    safeUserObject = {
      displayName: validator.escape(req.user.displayName),
      provider: validator.escape(req.user.provider),
      username: validator.escape(req.user.username),
      created: req.user.created.toString(),
      roles: req.user.roles,
      profileImageURL: req.user.profileImageURL,
      email: validator.escape(req.user.email),
      lastName: validator.escape(req.user.lastName),
      firstName: validator.escape(req.user.firstName),
      additionalProvidersData: req.user.additionalProvidersData
    };
  }

  res.render('modules/core/server/views/index', {
    user: JSON.stringify(safeUserObject),
    sharedConfig: JSON.stringify(config.shared)
  });
};

/**
 * Render the server error page
 */
exports.renderServerError = function (req, res) {
  res.status(500).render('modules/core/server/views/500', {
    error: 'Oops! Something went wrong...'
  });
};

/**
 * Render the server not found responses
 * Performs content-negotiation on the Accept HTTP header
 */
exports.renderNotFound = function (req, res) {

  res.status(404).format({
    'text/html': function () {
      res.render('modules/core/server/views/404', {
        url: req.originalUrl
      });
    },
    'application/json': function () {
      res.json({
        error: 'Path not found'
      });
    },
    'default': function () {
      res.send('Path not found');
    }
  });
};



exports.uploads = function (req, res) {
  console.log('req.headers.content-type:-------'+req.headers['content-type']); //must be multipart/form-data
  console.log('req.files.uploadedFile: --------'+req.files.uploadedFile); //file object
  console.log('req.files.uploadedFile.fieldname: ------'+req.files.uploadedFile.fieldName);// "uploadedFile"
  console.log('req.files.uploadedFile.name:--------- '+req.files.uploadedFile.name); // original filename
  console.log('req.files.uploadedFile.originalFilename: ---------'+req.files.uploadedFile.originalFilename); // orininal Filename
  console.log('req.files.uploadedFile.type: --------'+req.files.uploadedFile.type); //image/jpeg
  console.log('req.files.uploadedFile.size: ------- '+req.files.uploadedFile.size); // file size
  // console.log('req.body.testkey: '+req.body.testkey); // submited form

  var file=req.files.uploadedFile;
  var user = req.user;
  var message = null;

  console.log("---------------file----------------"+file);
  // user.username="Alex";
  //the target folder is /public/uploads/base64(username)/
  var userEncode = new Buffer("alex").toString('base64');
  // var userEncode = new Buffer(user.username).toString('base64');
  var destFolder = path.join(path.resolve('./'),config.uploads.fileUpload.dest,userEncode);
  var newFilename = file.originalFilename;
  var destFile = destFolder+"/"+newFilename;
  //var destURL = req.protocol + '://' + req.get('host') + config.uploads.fileUpload.dest+userEncode+"/"+Date.now()+".jpg";
  var destURL = config.uploads.fileUpload.dest+userEncode+"/"+newFilename;
  console.log('req.files.uploadedFile.size: ----111--- '+req.files.uploadedFile.size); // file size
  //config multer, somehow the diskStorage() is not working
  var storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, destFolder);
    },
    filename: function (req, file, cb) {
      cb(null, file.originalname + '-' + Date.now());
    }
  });

  var upload = multer({ storage : storage}).single('uploadedFile');
  // Filtering to upload only images
  upload.fileFilter = require(path.resolve('./config/lib/multer')).imageUploadFileFilter;
  console.log('req.files.uploadedFile.size: ----222222--- '+req.files.uploadedFile.size); // file size
  // upload file
  upload(req,res,function (err) {
    if(err) {
      return res.status(400).send({
        message: 'Error occurred while uploading profile picture'
      });
    }else{
      // For some reason, the diskStorage function of Multer doesn't work.
      // The following code is to move the file to the destination folder.
      console.log('req.files.uploadedFile.size: -rrrrr--3333333---- '+data); // file size
      var stat =null;
      try {
        stat = fs.statSync(destFolder);
      } catch (err) {
        fs.mkdirSync(destFolder);
      }
      if (stat && !stat.isDirectory()) {
        throw new Error('Directory cannot be created because an inode of a different type exists at "' + destFolder + '"');
      } else {
        console.log('req.files.uploadedFile.size: --yyyy-3333333---- '+data); // file size
        var readStream = fs.createReadStream(file.path);
        var writeStream = fs.createWriteStream(destFile);
        readStream.pipe(writeStream);
        console.log('req.files.uploadedFile.size: ---3333333---- '+data); // file size
        writeStream.on('finish',function(err,data) {
          console.log('req.files.uploadedFile.size: ---3333333---- '+data); // file size
          console.log('req.files.uploadedFile.size: ---3333333---- '+req.files.uploadedFile.size); // file size
          if (err) throw err;
          fs.unlinkSync(file.path,function(err) {
            console.log('req.files.uploadedFile.size: ---444333333---- '+req.files.uploadedFile.size); // file size
            if (err) {
              throw err;
            }else{
              console.log('req.files.uploadedFile.size: ---5555333---- '+req.files.uploadedFile.size); // file size
              return res.status(200).send({
                uploadedURL: destURL,
                uploadedFile: destFile,
                file: JSON.stringify(req.files),
                message: 'File is uploaded to ' + destURL
              });
            }
          });
        });



      }
    }
  });
};

