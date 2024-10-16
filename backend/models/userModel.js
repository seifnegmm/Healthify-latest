const crypto = require('crypto');
const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const userSchema = mongoose.Schema(
  {
    firstName: {
      type: String,
      minLength: [2, "First name can't be less than 2 characters!"],
    },
    fullName: {
      type: String,
      required: [true, 'User must have a full name'],
      validate: {
        validator: function (name) {
          const nameRegex = /^[a-zA-Z\s-]+$/;
          return nameRegex.test(name);
        },
        message: 'Full name ({VALUE}) should only contain letters.',
      },
    },
    username: {
      type: String,
      required: [true, 'User must have a username!'],
      unique: true,
      minLength: [5, "Username can't be less than 5 characters!"],
      validate: [
        validator.isAlphanumeric,
        'Username must be an alphanumeric value, please make sure there are no any other characters!',
      ],
    },
    email: {
      type: String,
      required: [true, 'User must have an email'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Please provide a valid email!'],
    },
    role: {
      type: String,
      enum: {
        values: ['user', 'admin'],
        message: 'Only an admin or a user is possible as roles!',
      },
      default: 'user',
    },
    password: {
      type: String,
      required: [true, 'Password is required!'],
      minLength: 8,
      select: false,
    },
    userID: {
      type: String,
      unique: true,
      required: [true, 'User must have an ID'],
      validate: [
        validator.isAlphanumeric,
        'User ID must be an alphanumeric value, please make sure there are no any other characters!',
      ],
      uppercase: true,
    },
    accessToken: {
      type: String,
      required: [true, 'Access token is requred!'],
    },
    refreshToken: {
      type: String,
      required: [true, 'Refresh token is required!'],
    },
    createdAt: {
      type: Date,
      default: Date.now(),
    },
    accessTokenCreationDate: {
      type: Date,
      required: [true, 'Access token creation date is required!'],
    },
    passwordChangedAt: Date,
    passwordResetToken: String,
    passwordResetExpires: Date,
    active: {
      type: Boolean,
      default: true,
      select: false,
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

userSchema.pre(/^find/, function (next) {
  this.find({ active: { $ne: false } });
  next();
});

userSchema.pre('save', function (next) {
  if (!this.firstName && this.role === 'user') {
    this.firstName = this.fullName.split(' ')[0];
  }
  next();
});

userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();

  this.password = await bcrypt.hash(this.password, 14);
  next();
});

userSchema.pre('save', function (next) {
  if (!this.isModified('password') || this.isNew) return next();

  this.passwordChangedAt = Date.now() - 1000;
  next();
});

userSchema.methods.correctPassword = async function (candidatePass, userPass) {
  return await bcrypt.compare(candidatePass, userPass);
};

userSchema.methods.changedPasswordAfter = function (JWTTimestamp) {
  if (this.passwordChangedAt) {
    const changedTimestamp = parseInt(
      this.passwordChangedAt.getTime() / 1000,
      10
    );
    return JWTTimestamp < changedTimestamp;
  }
  return false;
};

userSchema.methods.createPasswordResetToken = function () {
  const resetToken = crypto.randomBytes(32).toString('hex');

  this.passwordResetToken = crypto
    .createHash('sha256')
    .update(resetToken)
    .digest('hex');

  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

const User = mongoose.model('User', userSchema);

module.exports = User;
