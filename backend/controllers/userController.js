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

exports.fitbitProxy = catchAsync(async (req, res, next) => {
  const fitbitPath = req.params[0];
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next(new AppError('Missing or invalid Authorization header', 401));
  }

  const jwtToken = authHeader.split(' ')[1];

  const fitbitUrl = new URL(`https://api.fitbit.com/1/${fitbitPath}`);

  for (const [key, value] of Object.entries(req.query)) {
    fitbitUrl.searchParams.append(key, value);
  }

  try {
    const response = await fetch(fitbitUrl, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${jwtToken}`,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorData = await response.text();
      return next(new AppError(`Fitbit API error: ${errorData}`, response.status));
    }

    const contentType = response.headers.get('content-type');
    const data = contentType && contentType.includes('application/json')
      ? await response.json()
      : await response.text();

    res.status(response.status).json(data);
  } catch (error) {
    return next(new AppError(`Fitbit API request failed: ${error.message}`, 502));
  }
});

