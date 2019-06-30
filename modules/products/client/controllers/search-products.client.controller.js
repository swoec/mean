(function () {
  'use strict';

  angular
    .module('products')
    .controller('ProductsSearchController', ProductsListController);

  ProductsListController.$inject = ['ProductsService','ProductsService2','$scope','$state','$window'];

  function ProductsListController(ProductsService,ProductsService2,$scope,$state,$window) {
    var vm = this;



    $scope.find = function(){
      vm.products = ProductsService.query();

    }

    $scope.findWithParams = function() {
      console.log('--------findWithParams-------');

      // $scope.vm.product
        var res = ProductsService2.query({
        name: $scope.vm.product.name,
        sku: $scope.vm.product.sku
      });
      console.log(res);
    };


  $scope.findBySkuAndNames = function() {
    alert('0000');
    console.log('-------res---products---333---------'+$scope.vm.product.name);
    // vm.products.get({name: $scope.vm.product.name, sku: $scope.vm.product.sku},function (products) {
    //   console.log('-------res---products------eee------'+products);
    //   $scope.vm.products = products;
    // });
    vm.products.query({name: $scope.vm.product.name, sku: $scope.vm.product.sku}, function(products) {
      console.log('-------res---products------------'+products);
      $scope.vm.products = products;
    });
  }
  }
}());
