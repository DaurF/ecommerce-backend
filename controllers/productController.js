products = [
  {
    id: 1,
    name: 'NVIDIA RTX 2060',
    price: 1300
  }
];

// ROUTE HANDLERS
exports.getAllProducts = (req, res) => {
  console.log(req.requestTime)
  res.status(200).json({
    status: 'success',
    requestedAt: req.requestTime,
    results: products.length,
    data: {
      products
    }
  })
}

exports.getProduct = (req, res) => {
  res.send('Your request has been handled! 😘')
}

exports.createProduct = (req, res) => {
  console.log(req.body)
  res.send('Done')
}

exports.updateProduct = (req, res) => {
  res.status(200).json({
    status: 'success',
    data: {
      product: 'Product has been updated successfully!'
    }
  })
}

exports.deleteProduct = (req, res) => {
  res.status(204).json({
    status: 'success',
    data: null
  })
}
