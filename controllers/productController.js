const Product = require('../models/productModel')
const APIFeatures = require('../utils/apiFeatures')
const catchAsync = require('../utils/catchAsync')

exports.aliasTopProducts = (req, res, next) => {
  req.query.limit = '5';
  req.query.sort = '-ratingsAverage,price';
  req.query.fields = 'name,price,ratingsAverage,description';

  next();
}

exports.getAllProducts = catchAsync(async (req, res, next) => {
  // Выполняем запрос и получаем  результат
  const features = new APIFeatures(Product.find(), req.query)
    .filter()
    .sort()
    .limitFields()
    .paginate();
  const products = await features.query;

  // Отправляем ответ клиенту
  res.status(200).json({
    status: 'success',
    results: products.length,
    data: {
      products
    }
  })
})

exports.getProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findById(req.params.id);
  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  })
})


exports.createProduct = catchAsync(async (req, res, next) => {
  const newProduct = await Product.create(req.body)

  res.status(201).json({
    status: 'success',
    data: {
      product: newProduct
    }
  })
})

exports.updateProduct = catchAsync(async (req, res, next) => {
  const product = await Product.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true
  })
  res.status(200).json({
    status: 'success',
    data: {
      product
    }
  })
});

exports.deleteProduct = catchAsync(async (req, res, next) => {
  await Product.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: 'success',
    data: null
  })
});

exports.getProductStats = catchAsync(async (req, res, next) => {
  const stats = await Product.aggregate([
    {
      $match: {ratingsAverage: {$gte: 4.5}}
    },
    {
      $group: {
        _id: null,
        numProducts: {$sum: 1},
        numRatings: {$sum: '$ratingsQuantity'},
        avgRating: {$avg: '$ratingsAverage'},
        avgPrice: {$avg: '$price'},
        minPrice: {$min: '$price'},
        maxPrice: {$max: '$price'}
      }
    }
  ])

  res.status(200).json({
    status: 'success',
    data: {
      stats
    }
  })
})
