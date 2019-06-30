// Products service used to communicate Products REST endpoints
(function () {
  'use strict';

  angular
    .module('products')
    .factory('ProductsService', ProductsService)
    .factory('ProductsService2',ProductsService2);

  ProductsService.$inject = ['$resource'];
  ProductsService2.$inject = ['$resource'];

  function ProductsService($resource) {
    return $resource('/api/products/:productId', {
      productId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }

  function ProductsService2($resource) {
    return $resource('/products/search?name=:name&sku=:sku', {
      name: '',
      sku:''
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
}());
