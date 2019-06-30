'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Product Schema
 */
var ProductSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    trim: true
  }, sku: {
    type: String,
    default: '',
    required: 'Please fill Product name',
    trim: true
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Description',
    trim: false
  },
  articleImageURL: {
    type: String,
    default: '',
    required: [false,'Please upload image'],
    trim: false
  },
  price: {
    type: String,
    default: '',
    required: 'Please fill price',
    trim: false
  },
  availableStockQuantity: {
    type: String,
    default: '',
    required: 'Please fill Available Stock Quantity',
    trim: false
  },
  category: {
    type: String,
    default: '',
    required: 'Please fill Available Stock Quantity',
    trim: false
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Product', ProductSchema);
