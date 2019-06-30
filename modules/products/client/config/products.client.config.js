(function () {
  'use strict';

  angular
    .module('products')
    .run(menuConfig);

  menuConfig.$inject = ['menuService'];

  function menuConfig(menuService) {
    // Set top bar menu items
    menuService.addMenuItem('topbar', {
      title: 'Products',
      state: 'products',
      type: 'dropdown',
      roles: ['user']
    });

    // Add the dropdown list item
    menuService.addSubMenuItem('topbar', 'products', {
      title: 'List Products',
      state: 'products.list'
    });

    menuService.addSubMenuItem('topbar', 'products', {
      title: 'search Products',
      state: 'products.search'
    });

    // Add the dropdown create item
    menuService.addSubMenuItem('topbar', 'products', {
      title: 'Create Product',
      state: 'products.create',
      roles: ['user']
    });
  }
}());
