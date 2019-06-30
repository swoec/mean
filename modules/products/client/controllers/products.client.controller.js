(function () {
  'use strict';

  // Products controller
  angular
    .module('products')
    .controller('ProductsController', ProductsController);
  ProductsController.$inject = ['$scope', '$state', '$location', '$http', '$window', 'Authentication', 'productResolve', 'Upload', '$timeout', 'filterFilter'];

  function ProductsController($scope, $state, $location, $http, $window, Authentication, productResolve, Upload, $timeout) {
    var vm = this;
    vm.authentication = Authentication;
    vm.product = productResolve;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    $scope.uploadFiles = function (file, errFiles) {
      $scope.uploadedFile = file;
      $scope.errFile = errFiles && errFiles[0];
      console.log($scope.uploadedFile.name)
      if (file) {
        file.upload = Upload.upload({
          url: '/api/uploads',
          data: {uploadedFile: file}
        });

        file.upload.then(function (response) {
          console.log('File is successfully uploaded to ' + response.data.uploadedURL);
          $scope.articleImageURL = response.data.uploadedURL;
          $timeout(function () {
            file.result = response.data;
          });
        }, function (response) {
          if (response.status > 0)
            $scope.errorMsg = response.status + ': ' + response.data;
        }, function (evt) {
          file.progress = Math.min(100, parseInt(100.0 *
            evt.loaded / evt.total));
        });
      }
    };

    // Remove existing Product
    function remove() {
      if ($window.confirm('Are you sure you want to delete?')) {
        vm.product.$remove($state.go('products.list'));
      }
    }
    $scope.selection = [];
    vm.product.category = [];

    // Save Product
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        return false;
      }
      var product = $scope.vm.product;
      product.articleImageURL = '/modules/core/client/img/uploads/' + $scope.uploadedFile.name;
      product.$save(function (response) {
        $state.go('products.view', {
          productId: response._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });

    }

    $scope.init = function () {
      $http({
        method: 'GET',
        url: '/api/categories'
      }).then(function successCallback(response) {
        $scope.categories = response.data;
      }, function errorCallback(response) {
        console.log(response);
      });
    };

    $scope.checkedFruits = [];
    $scope.toggleCheck = function (fruit) {
      if ($scope.checkedFruits.indexOf(fruit) === -1) {
        $scope.checkedFruits.push(fruit);
        $scope.vm.product.category = [...$scope.checkedFruits];
      } else {
        $scope.checkedFruits.splice($scope.checkedFruits.indexOf(fruit), 1);
        $scope.vm.product.category = [...$scope.checkedFruits];
      }
    };

    $scope.update = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');

        return false;
      }
      var product = $scope.vm.product;
      if ($scope.uploadedFile != undefined) {
        product.articleImageURL = '/modules/core/client/img/uploads/' + $scope.uploadedFile.name;
      }

      product.$update(function (response) {
        $state.go('products.view', {
          productId: response._id
        });

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });


    };
  }
}());
