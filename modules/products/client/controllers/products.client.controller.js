(function () {
  'use strict';

  // Products controller
  angular
    .module('products')
    .controller('ProductsController', ProductsController);

  ProductsController.$inject = ['$scope', '$state','$location', '$window','$http','Authentication', 'productResolve','Upload', '$timeout'];

  function ProductsController ($scope, $state, $location,$http, $window,Authentication, productResolve,Upload, $timeout) {
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


      product.articleImageURL = '/modules/core/client/img/uploads/'+$scope.uploadedFile.name;

      console.log(product.articleImageURL);

      product.$save(function (response) {
        console.log("---------------------------"+response._id)
        // $location.path('api/products/' + response._id);
        console.log('response id------------'+response._id);
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

    // $scope.querys = function (isValid){
    //   $scope.error = null;
    //   console.log("-------------query--------------");
    //   if (!isValid) {
    //     $scope.$broadcast('show-errors-check-validity', 'vm.form.productForm');
    //
    //     return false;
    //   }
    //   var product = $scope.vm.product;
    //
    //   product.query().then(function (data) {
    //     $location.path('/');
    //
    //   });
    //
    //
    // }

    $scope.init = function(){

      $http({
        method: 'GET',
        url: '/categories'
      }).then(function successCallback(response) {
        $scope.categories = response.data;
        // this callback will be called asynchronously
        // when the response is available
      }, function errorCallback(response) {
        console.log(response);
        // called asynchronously if an error occurs
        // or server returns response with an error status.
      });

      // $http.get('/categories').then(function(res){
      //
      //     $scope.categories = res.data;
      //
      //
      // }, function(err){
      //   console.log(err);
      // })
    };

    $scope.toggleSelection = function toggleSelection(fruitName) {
      var idx = $scope.vm.product.categories.indexOf(fruitName);

      // Is currently selected
      if (idx > -1) {
        $scope.vm.product.categories.splice(idx, 1);
      }

      // Is newly selected
      else {
        $scope.vm.product.categories.push(fruitName);
      }
    };

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
      if($scope.uploadedFile != undefined) {
        product.articleImageURL = 'modules/core/client/img/uploads/' + $scope.uploadedFile.name;
      }
      // $http.get("api/product/"+product._id).then(function (res) {
      //   console.log(res);
      //
      // }, function (err) {
      //   console.log(err);
      // });
      //
      // $http.put("api/product/"+product._id, JSON.stringify(product))
      //   .then(
      //     function(response){
      //       // success callback
      //       $location.path('api/product/' + product._id);
      //     },
      //     function(response){
      //       // failure callback
      //       $scope.error = response.data.message;
      //     }
      //   );

      // $http.put('api/product/'+product._id+product).success(function (data) {
      //   $location.path('api/product/' + product._id);
      // }).error(function (errorResponse) {
      //   $scope.error = errorResponse.data.message;
      // });

      product.$update(function (response) {
        console.log("---------------------------"+response._id)
        // $location.path('api/products/' + response._id);
        $state.go('products.view', {
          productId: response._id
        });

      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });

      // product.$update(function () {
      //   $location.path('/api/product/' + product._id);
      // }, function (errorResponse) {
      //   $scope.error = errorResponse.data.message;
      // });
    };
  }
}());
