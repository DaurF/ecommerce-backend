const stripe = require('stripe')(process.env.STRIPE_SECRET_KEY);
const Product = require('../models/productModel');

exports.getCheckoutSession = async (req, res, next) => {
  const product = await Product.findById(req.params.productId);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    success_url: `http://127.0.0.1:5173`,
    cancel_url: `http://127.0.0.1:5173/products/${product._id}`,
    // success_url: `${req.protocol}://${req.get('host')}/`,
    // cancel_url: `${req.protocol}://${req.get('host')}/products/${product._id}`,
    customer_email: req.user.email,
    client_reference_id: req.params.productId,
    line_items: [
      {
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${product.manufacturer} ${product.model}`,
          },
          unit_amount: Math.round((product.price / 453) * 100),
        },
        quantity: 1,
      },
    ],
    // payment_intent_data: {
    //   description: product.description
    // }
  });

  res.status(200).json({
    status: 'success',
    session,
  });
};
