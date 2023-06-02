const mongoose = require('mongoose');
const slugify = require('slugify');

const productSchema = new mongoose.Schema({
    name: {
      type: String,
      required: [true, 'A product must have a name'],
      unique: true,
      trim: true,
    },
    slug: String,
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
    },
    secretProduct: {
      type: Boolean,
      default: false
    }
  },

// {
//   toJSON: {virtuals: true},
//   toObject: {virtuals: true},
// }
)

productSchema.pre('save', function (next) {
  this.slug = slugify(this.name, {lower: true});
  next();
});

productSchema.pre(/^find/, function (next) {
  this.find({secretProduct: {$ne: true}});

  this.start = Date.now();
  next();
});

productSchema.post(/^find/, function (docs, next) {
  console.log(`Query took ${Date.now() - this.start} milliseconds!`)
  next();
});

productSchema.pre('aggregate', function (next) {
  this.pipeline().unshift({$match: {secretProduct: {$ne: true}}})
  next();
});

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
