const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'A product must have a name'],
    unique: true,
    trim: true,
  },
  ratingsAverage: {
    type: Number,
    default: 4.5
  },
  ratingsQuantity: {
    type: Number,
    default: 0,
  },
  price: {
    type: Number,
    required: [true, 'A product must have a price']
  },
  priceDiscount: Number,
  description: {
    type: String,
    trim: true
  },
  imageCover: {
    type: String,
    required: [true, 'A product must have a cover image']
  },
  images: [String],
  createdAt: {
    type: Date,
    default: Date.now(),
    select: false
  }
})

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
