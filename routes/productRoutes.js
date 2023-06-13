const express = require('express');
const productController = require('../controllers/productController');
const authController = require('../controllers/authController');
const reviewController = require('../controllers/reviewController');
const reviewRouter = require('./reviewRoutes');

const router = express.Router();

router.use('/:productId/reviews', reviewRouter);

router
  .route('/top-5-cheap')
  .get(productController.aliasTopProducts, productController.getAllProducts);

router.route('/product-stats').get(productController.getProductStats);

router
  .route('/')
  .get(authController.protect, productController.getAllProducts)
  .post(productController.createProduct);

router
  .route('/:id')
  .get(productController.getProduct)
  .patch(productController.updateProduct)
  .delete(
    authController.protect,
    authController.restrictTo('moderator', 'admin'),
    productController.deleteProduct
  );

router
  .route('/:productId/reviews')
  .post(
    authController.protect,
    authController.restrictTo('user'),
    reviewController.createReview
  );

module.exports = router;
