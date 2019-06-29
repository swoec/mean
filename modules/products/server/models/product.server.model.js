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
  },
  description: {
    type: String,
    default: '',
    required: 'Please fill Description',
    trim: true
  },
  articleImageURL: {
    type: String,
    default: '',
    required: 'Please upload image',
    trim: true
  },
  price: {
    type: String,
    default: '',
    required: 'Please fill price',
    trim: true
  },
  availableStockQuantity: {
    type: String,
    default: '',
    required: 'Please fill Available Stock Quantity',
    trim: true
  },
  category: {
    type: String,
    default: '',
    required: 'Please fill Available Stock Quantity',
    trim: true
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
