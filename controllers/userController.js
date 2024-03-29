const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const factory = require('./handlerFactory');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach(el => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });
  return newObj;
};

exports.getMe = (req, res, next) => {
  req.params.id = req.user.id;
  next();
};

exports.createUser = (req, res) => {
  res.status(500).json({
    status: 'error',
    message: 'This route is not defined! Please use /signup instead',
  });
};

exports.updateMe = async (req, res, next) => {
  if (req.body.password || req.body.passwordConfirm) {
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );
  }

  const filteredBody = filterObj(req.body, 'name', 'email');
  const updatedUser = await User.findByIdAndUpdate(req.user._id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'success',
    data: {
      user: updatedUser,
    },
  });
};

exports.deleteMe = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, { active: false });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.addToCart = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(
    req.user._id,
    { $push: { cartItems: req.body } },
    { new: true, runValidators: true }
  );

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.removeFromCart = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user._id, {
    $pull: { cartItems: req.body._id },
  });

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

exports.getCart = catchAsync(async (req, res, next) => {
  const { cartItems } = await User.findById(req.user._id).populate({
    path: 'cartItems',
    fields: 'cartItems',
  });

  res.status(200).json({
    status: 'success',
    data: {
      data: cartItems,
    },
  });
});

exports.getAllUsers = factory.getAll(User);
exports.getUser = factory.getOne(User, { path: 'products' });
exports.updateUser = factory.updateOne(User);
exports.deleteUser = factory.deleteOne(User);
