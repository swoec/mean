(function () {
  'use strict';

  // Products controller
  angular
    .module('products')
    .controller('ProductsController', ProductsController);

  ProductsController.$inject = ['$scope', '$state','$location', '$window', '$http','Authentication', 'productResolve','Upload', '$timeout'];

  function ProductsController ($scope, $state, $location, $window,$http, Authentication, productResolve,Upload, $timeout) {
    var vm = this;

    vm.authentication = Authentication;
    vm.product = productResolve;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;


    $scope.uploadFiles = function(file, errFiles) {
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

    // Save Product
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
        return false;
      }
      console.log($scope);
      console.log(vm.product.name);


      var product = $scope.vm.product;
      console.log("-------------------"+product);


      product.articleImageURL = 'modules/core/client/img/uploads/'+$scope.uploadedFile.name;

      console.log(product.articleImageURL);

      product.$save(function (response) {
        console.log("---------------------------"+response._id)
        // $location.path('api/products/' + response._id);
        $state.go('products.view', {
          productId: response._id
        });

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });

      function successCallback(res) {
        $state.go('products.view', {
          productId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }

    $scope.update = function (isValid) {
      $scope.error = null;
      console.log("-------------update--------------");
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');

        return false;
      }

      // var article = $scope.article;
      // article.articleImageURL = $scope.articleImageURL;
      console.log($scope);
      var product = $scope.vm.product;
      product.articleImageURL = 'modules/core/client/img/uploads/'+$scope.uploadedFile.name;

      product.$update(function () {
        $location.path('api/product/' + product._id);
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
}());
