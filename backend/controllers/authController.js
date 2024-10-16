const crypto = require('crypto');
const { promisify } = require('util');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');
const catchAsync = require('../utils/catchAsync');
const AppError = require('../utils/appError');
const sendEmail = require('../utils/email');

const signToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN,
  });
};

const filterObj = (obj, ...unAllowedFields) => {
  const newObj = {};
  Object.keys(obj).forEach((el) => {
    if (!unAllowedFields.includes(el)) newObj[el] = obj[el];
  });

  return newObj;
};

exports.signup = catchAsync(async (req, res) => {
  const newBody = filterObj(req.body, 'role');
  const newUser = await User.create(newBody);

  console.log(`User ${newUser.username} created!`);

  const message = `Your healthify account has been created!
  \nThank you for using our app :)`;

  await sendEmail({
    email: newUser.email,
    subject: 'Healthify account created 🎉🎉',
    message,
  });

  res.status(201).json({
    status: 'Success',
    message: 'User created successfully!',
  });
});

exports.login = catchAsync(async (req, res, next) => {
  const { username, password } = req.body;

  if (!username || !password) {
    return next(new AppError('Please provide username and password!', 400));
  }

  const user = await User.findOne({ username }).select('+password');

  if (!user || !(await user.correctPassword(password, user.password))) {
    return next(new AppError('Incorrect email or password!', 401));
  }
  console.log(`User ${user.username} logged in!`);

  const token = signToken(user._id);
  res.status(200).json({
    status: 'success',
    token,
  });
});

exports.protect = catchAsync(async (req, res, next) => {
  let token;
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return next(
      new AppError('You are not logged in! Please log in to get access.', 401)
    );
  }

  const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
  const { id } = decoded;

  const freshUser = await User.findById(id);
  if (!freshUser) {
    return next(
      new AppError(
        'The user belonging to this token does no longer exists.',
        401
      )
    );
  }

  if (freshUser.changedPasswordAfter(decoded.iat)) {
    return next(
      new AppError('User recently changed password! Please log in again!')
    );
  }

  req.user = freshUser;

  next();
});

exports.restrictTo = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      return next(
        new AppError('You do not have permission to perform this action.', 403)
      );
    }
    next();
  };
};

exports.forgotPassword = catchAsync(async (req, res, next) => {
  const { email } = req.body;

  const user = await User.findOne({ email });
  if (!user)
    return next(new AppError('There is no user with this email address.', 404));

  const resetToken = user.createPasswordResetToken();

  await user.save({ validateBeforeSave: false });

  const resetURL = `http://localhost/resetPassword.html?token=${resetToken}`;

  const message = `Forgot your password? Submit a PATCH request with your new password to:\n\n${resetURL}
  \n\nIf you didn't forget your password, please ignore this email!`;

  try {
    await sendEmail({
      email: user.email,
      subject: 'Reset your password (valid for 10 minutes)',
      message,
    });

    res.status(200).json({
      status: 'success',
      message: 'Password reset token sent to email!',
    });
  } catch (err) {
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;
    await user.save({ validateBeforeSave: false });

    return next(
      new AppError(
        'There was an error sending the email. Try again later!',
        500
      )
    );
  }
});

exports.resetPassword = catchAsync(async (req, res, next) => {
  const hashedToken = crypto
    .createHash('sha256')
    .update(req.params.token)
    .digest('hex');

  const user = await User.findOne({
    passwordResetToken: hashedToken,
    passwordResetExpires: { $gt: Date.now() },
  });

  if (!user) return next(new AppError('Token is invalid or has expired.', 400));

  user.password = req.body.password;
  user.passwordResetToken = undefined;
  user.passwordResetExpires = undefined;

  await user.save();

  res.status(200).json({
    status: 'success',
    message: 'Password Updated!',
  });
});

exports.updatePassword = catchAsync(async (req, res, next) => {
  const id = req.user.id;
  const user = await User.findById(id).select('+password');
  user.password = req.body.newPassword;

  await user.save();

  const token = signToken(user._id);

  res.status(200).json({
    status: 'Success',
    message: 'Password changed successfully!',
    token,
  });
});
