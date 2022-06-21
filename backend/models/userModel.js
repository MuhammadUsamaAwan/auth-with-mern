const mongoose = require('mongoose')

const userSchema = mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add your name'],
      minLength: [6, 'Name must be between 6 20 characters'],
      maxLength: [20, 'Name must be between 6 to 20 characters'],
    },
    email: {
      type: String,
      required: [true, 'Please add your email'],
      match: [/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/, 'Please add a validate email'],
      unique: true,
    },
    password: {
      type: String,
      required: [true, 'Please add your password'],
    },
    emailVerified: {
      type: Boolean,
      default: false,
    },
    refreshToken: String,
  },
  {
    timestamps: true,
  }
)

module.exports = mongoose.model('User', userSchema)
