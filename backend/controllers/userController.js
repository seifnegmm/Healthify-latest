const User = require('../models/userModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');

const filterObj = (obj, ...allowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (allowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.getUserData = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findById(id).select(
    'fullName firstName userID username accessToken email accessTokenCreationDate refreshToken'
  );
  if (!user) return next(new AppError('User not found!', 404));

  res.status(200).json({
    status: 'sucess',
    data: {
      user,
    },
  });
});

exports.updateUser = catchAsync(async (req, res, next) => {
  if (req.body.password)
    return next(
      new AppError(
        'This route is not for password updates. Please use /updateMyPassword.',
        400
      )
    );

  const filteredBody = filterObj(
    req.body,
    'firstName',
    'fullName',
    'email',
    'refreshToken',
    'accessToken',
    'accessTokenCreationDate'
  );

  const updatedUser = await User.findByIdAndUpdate(req.user.id, filteredBody, {
    new: true,
    runValidators: true,
  });

  res.status(200).json({
    status: 'Success',
    data: {
      user: updatedUser,
    },
  });
});

exports.deleteUser = catchAsync(async (req, res, next) => {
  await User.findByIdAndUpdate(req.user.id, { active: false });

  res.status(204).json({
    status: 'sucess',
    data: null,
  });
});

exports.getAllUsers = catchAsync(async (req, res, next) => {
  const users = await User.find();

  res.status(200).json({
    status: 'success',
    data: {
      users,
    },
  });
});
