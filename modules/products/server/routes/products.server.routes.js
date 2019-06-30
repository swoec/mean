'use strict';

/**
 * Module dependencies
 */
var productsPolicy = require('../policies/products.server.policy'),
  products = require('../controllers/products.server.controller');

module.exports = function(app) {
  // Products Routes
  app.route('/api/products').all(productsPolicy.isAllowed)
    .get(products.list)
    .get(products.productBySkuandName)
    .post(products.create);

  app.route('/api/products/:productId').all(productsPolicy.isAllowed)
    .get(products.read)
    .put(products.update)
    .delete(products.delete);

  // app.route(':productId/api/products/:productId').all(productsPolicy.isAllowed)
  //   .put(products.update);


  // Finish by binding the Product middleware
  app.param('productId', products.productByID);
};
