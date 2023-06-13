const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema(
  {
    manufacturer: {
      type: String,
      required: [true, 'A product must have a manufacturer'],
      trim: true,
      maxlength: [
        40,
        'A product manufacturer must have less or equal than 40 characters',
      ],
    },
    model: {
      type: String,
      required: [true, 'A product must have a manufacturer'],
      trim: true,
      maxlength: [
        40,
        'A product model must have less or equal than 40 characters',
      ],
    },
    // SMARTPHONE
    operatingSystem: {
      type: String,
      required: true,
    },
    cpu: {
      type: String,
      required: true,
    },
    ram: Number,
    storage: Number,
    displaySize: Number,
    displayRes: String,
    panel: {
      type: String,
      enum: ['ips', 'va', 'tn'],
    },
    rearCamera: {
      type: String,
      required: true,
    },
    frontCamera: {
      type: String,
      required: true,
    },
    batteryCapacity: {
      type: Number,
      required: true,
    },
    connectivity: {
      type: Array,
      default: [],
    },
    weight: {
      type: Number,
      required: true,
    },
    height: {
      type: Number,
      required: true,
    },
    width: {
      type: Number,
      required: true,
    },
    title: {
      type: String,
      required: [true, 'A product must have a title'],
      unique: true,
      trim: true,
      maxlength: [
        40,
        'A product title must have less or equal than 40 characters',
      ],
      minlength: [
        10,
        'A product title must have more or equal than 10 characters',
      ],
    },
    description: {
      type: String,
      trim: true,
    },
    slug: String,
    ratingsAverage: {
      type: Number,
      default: 4.5,
      min: [1, 'Rating must be above 1.0'],
      max: [5, 'Rating must be below 5.0'],
    },
    ratingsQuantity: {
      type: Number,
      default: 0,
    },
    price: {
      type: Number,
      required: [true, 'A product must have a price'],
    },
    priceDiscount: {
      type: Number,
      validate: {
        validator: function (val) {
          return val < this.price;
        },
        message: 'Discount price ({VALUE}) should be below regular price',
      },
    },

    imageCover: {
      type: String,
      required: [true, 'A product must have a cover image'],
    },
    images: [String],
    createdAt: {
      type: Date,
      default: Date.now(),
      select: false,
    },
    secretProduct: {
      type: Boolean,
      default: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

productSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'product',
  localField: '_id',
});

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, { lower: true });
  next();
});

productSchema.pre(/^find/, function (next) {
  this.find({ secretProduct: { $ne: true } });

  this.start = Date.now();
  next();
});

productSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`);
  next();
});

productSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({ $match: { secretProduct: { $ne: true } } });
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
