'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Product = mongoose.model('Product'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  fs = require('fs'),
  multer = require('multer'),
  multerS3 = require('multer-s3'),
  aws = require('aws-sdk'),
  amazonS3URI = require('amazon-s3-uri'),
  config = require(path.resolve('./config/config')),
  _ = require('lodash');

var useS3Storage = config.uploads.storage === 's3' && config.aws.s3;
var s3;

if (useS3Storage) {
  aws.config.update({
    accessKeyId: config.aws.s3.accessKeyId,
    secretAccessKey: config.aws.s3.secretAccessKey
  });

  s3 = new aws.S3();
}


/**
 * Create a Product
 */
exports.create = function(req, res) {
  var product = new Product(req.body);
  product.user = req.user;
  var user = req.user;
  var existingImageUrl;

 console.log("-------------create------------------"+product.user)
  // console.log("------------create------------"+req.files)
  console.log("------------create------------"+product.name)
  // var multerConfig;
  // if (useS3Storage) {
  //   multerConfig = {
  //     storage: multerS3({
  //       s3: s3,
  //       bucket: config.aws.s3.bucket,
  //       acl: 'public-read'
  //     })
  //   };
  // } else {
  //   multerConfig = config.uploads.profile.image;
  // }
  // multerConfig.fileFilter = require(path.resolve('./config/lib/multer')).imageFileFilter;
  //
  // var upload = multer(multerConfig).single('newProfilePicture');

  // if (user) {
  //   existingImageUrl = product.image;
  //   uploadImage()
  //       .then(function () {
  //       res.json(user);
  //     })
  //     .catch(function (err) {
  //       res.status(422).send(err);
  //     });
  // } else {
  //   res.status(401).send({
  //     message: 'User is not signed in'
  //   });
  // }


  // function uploadImage() {
  //   return new Promise(function (resolve, reject) {
  //     upload(req, res, function (uploadError) {
  //       if (uploadError) {
  //         reject(errorHandler.getErrorMessage(uploadError));
  //       } else {
  //         resolve();
  //       }
  //     });
  //   });
  // }


  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Show the current Product
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var product = req.product ? req.product.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  product.isCurrentUserOwner = req.user && product.user && product.user._id.toString() === req.user._id.toString();

  res.jsonp(product);
};

/**
 * Update a Product
 */
exports.update = function(req, res) {
  var product = req.product;

  product = _.extend(product, req.body);

  product.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * Delete an Product
 */
exports.delete = function(req, res) {
  var product = req.product;

  product.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(product);
    }
  });
};

/**
 * List of Products
 */
exports.list = function(req, res) {
  Product.find().sort('-created').populate('user', 'displayName').exec(function(err, products) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(products);
    }
  });
};

/**
 * Product middleware
 */
exports.productByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Product is invalid'
    });
  }

  Product.findById(id).populate('user', 'displayName').exec(function (err, product) {
    if (err) {
      return next(err);
    } else if (!product) {
      return res.status(404).send({
        message: 'No Product with that identifier has been found'
      });
    }
    req.product = product;
    next();
  });
};
