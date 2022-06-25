const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const nodemailer = require('nodemailer')
const asyncHandler = require('express-async-handler')
const User = require('../models/userModel')

// @desc    Signup a user
// @route   POST /auth/signup
// @access  Public
const signup = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body
  // checking for fields
  if (!name) {
    res.status(400)
    throw new Error('Please add your name')
  }
  if (name.length < 5 || name.length > 21) {
    res.status(400)
    throw new Error('Name should be between 6 to 20 characters')
  }
  if (!email) {
    res.status(400)
    throw new Error('Please add your email')
  }
  if (!email.match(/^[\w-.]+@([\w-]+\.)+[\w-]{2,4}$/)) {
    res.status(400)
    throw new Error('Please add a valid email')
  }
  if (!password) {
    res.status(400)
    throw new Error('Please add your password')
  }
  if (
    !password.match(/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[a-zA-Z]).{8,30}$/)
  ) {
    res.status(400)
    throw new Error('Password is too weak')
  }
  // checking if user already exists
  const userExists = await User.findOne({ email })
  if (userExists) {
    res.status(400)
    throw new Error('User already exists')
  }
  // hashing password
  const salt = await bcrypt.genSalt(10)
  const hashedPassword = await bcrypt.hash(password, salt)
  // creating the user in db
  const user = await User.create({
    name,
    email,
    password: hashedPassword,
    emailVerified: false,
    refreshToken: jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    }),
  })
  if (user) {
    // sending email confirmation
    const transporter = nodemailer.createTransport({
      host: 'smtp-mail.outlook.com',
      port: 587,
      auth: {
        user: 'mernauth@outlook.com',
        pass: process.env.EMAIL_PASS,
      },
    })
    await transporter.sendMail({
      from: 'mernauth@outlook.com',
      to: email,
      subject: 'Confirm your email',
      text: `Hello ${name}! Please confirm your email by clicking on this link ${jwt.sign(
        { email },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '10s' }
      )}`,
    })
    // sending response
    res.status(201).json({
      message: 'Email Sent',
    })
  } else {
    res.status(400)
    throw new Error('Invalid user data')
  }
})

// @desc    Resent verification email
// @route   POST /auth/resent
// @access  Public
const resent = asyncHandler(async (req, res) => {
  const { email } = req.body
  // checking fields
  if (!email) {
    res.status(400)
    throw new Error('Please add your email')
  }
  // checking if user exists
  const user = await User.findOne({ email })
  if (!user) {
    res.status(400)
    throw new Error("User doesn't Exist")
  }
  // sending email confirmation
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    auth: {
      user: 'mernauth@outlook.com',
      pass: process.env.EMAIL_PASS,
    },
  })
  await transporter.sendMail({
    from: 'mernauth@outlook.com',
    to: email,
    subject: 'Confirm your email',
    text: `Hello ${
      user.name
    }! Please confirm your email by clicking on this link ${jwt.sign(
      { email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10s' }
    )}`,
  })
  // sending response
  res.status(201).json({
    message: 'Email Sent',
  })
})

// @desc    Verify user email
// @route   POST /auth/verify
// @access  Public
const verify = asyncHandler(async (req, res) => {
  const { token } = req.body
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findOne({ email: decoded.email })
    user.emailVerified = true
    user.save()
    res.status(200).json({
      message: 'Email Verified',
    })
  } catch (err) {
    res.status(403)
    throw new Error('Not authorized')
  }
})

// @desc    Authenticate a user
// @route   POST /auth/login
// @access  Public
const login = asyncHandler(async (req, res) => {
  const { email, password } = req.body
  // check for fields
  if (!email) {
    res.status(400)
    throw new Error('Please add your email')
  }
  if (!password) {
    res.status(400)
    throw new Error('Please add your password')
  }
  // checking if user exists
  const user = await User.findOne({ email })
  // checking credentials
  if (user && (await bcrypt.compare(password, user.password))) {
    // checking if email is verified
    if (!user.emailVerified) {
      res.status(400)
      throw new Error('Email not verified')
    }
    // saving refresh token and sending it
    const refreshToken = jwt.sign({ email }, process.env.REFRESH_TOKEN_SECRET, {
      expiresIn: '1d',
    })
    user.refreshToken = refreshToken
    user.save()
    // sending response
    res.cookie('jwt', refreshToken, {
      httpOnly: true,
      sameSite: 'None',
      secure: true,
      maxAge: 24 * 60 * 60 * 1000,
    })
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      accessToken: jwt.sign({ email }, process.env.ACCESS_TOKEN_SECRET, {
        expiresIn: '10s',
      }),
    })
  } else {
    res.status(400)
    throw new Error('Invalid credentials')
  }
})

// @desc    Refresh access token
// @route   POST /auth/refresh
// @access  Public
const refresh = asyncHandler(async (req, res) => {
  // checking for cookies
  const cookies = req.cookies
  if (!cookies?.jwt) return res.status(401)
  const refreshToken = cookies.jwt

  // finding user
  const user = await User.findOne({ refreshToken })
  // if no user
  if (!user) {
    res.status(403)
    throw new Error('Forbidden')
  }
  const accessToken = jwt.sign(
    { email: user.email },
    process.env.ACCESS_TOKEN_SECRET
  )
  res.status(200).json({ accessToken })
})

// @desc    Logout a user
// @route   POST /auth/logout
// @access  Private
const logout = asyncHandler(async (req, res) => {
  const cookies = req.cookies
  // checking for cookie
  if (!cookies?.jwt) return res.sendStatus(204)
  // retriving cookie
  const refreshToken = cookies.jwt
  // checking for cookie in db
  const user = await User.findOne({ refreshToken })
  // if not clear cookie
  if (!user) {
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    return res.sendStatus(204)
  }
  // if yes clear cookie and delete from db
  user.refreshToken = ''
  user.save()
  res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
  res.sendStatus(204)
})

// @desc    Change User Password
// @route   POST /auth/changepassword
// @access  Private
const changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body
  // checking fields
  if (!currentPassword) {
    res.status(400)
    throw new Error('Please enter your current password')
  }
  if (!newPassword) {
    res.status(400)
    throw new Error('Please enter your new password')
  }
  // checking current password
  const user = await User.findOne({ email: req.user.email })
  if (await bcrypt.compare(currentPassword, user.password)) {
    // changing password
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(newPassword, salt)
    user.password = hashedPassword
    user.save()
    res.status(200).json({ message: 'Password change' })
  } else {
    res.status(403)
    throw new Error('Current password is invalid')
  }
})

// @desc    Reset User Password
// @route   POST /auth/resetpassword
// @access  Public
const resetPasswordLink = asyncHandler(async (req, res) => {
  const { email } = req.body
  // checking fields
  if (!email) {
    res.status(400)
    throw new Error('Please enter your email')
  }
  // finding the user
  const user = await User.findOne({ email })
  if (!user) {
    // if no user send message only
    res.status(200).json({ message: 'Password reset link send' })
  }
  // sending password reset
  const transporter = nodemailer.createTransport({
    host: 'smtp-mail.outlook.com',
    port: 587,
    auth: {
      user: 'mernauth@outlook.com',
      pass: process.env.EMAIL_PASS,
    },
  })
  await transporter.sendMail({
    from: 'mernauth@outlook.com',
    to: email,
    subject: 'Reset Password Link',
    text: `Hello ${
      user.name
    }! Please reset your password by clicking on this link ${jwt.sign(
      { email },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: '10s' }
    )}`,
  })
  res.status(200).json({ message: 'Password reset link send' })
})

// @desc    Reset User Password
// @route   POST /auth/resetpassword
// @access  Public
const resetPassword = asyncHandler(async (req, res) => {
  const { token, password } = req.body
  // checking fields
  if (!token) {
    res.status(401)
    throw new Error('Not authorized, no token')
  }
  if (!password) {
    res.status(400)
    throw new Error('Please add your new password')
  }
  try {
    const decoded = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET)
    const user = await User.findOne({ email: decoded.email })
    const salt = await bcrypt.genSalt(10)
    const hashedPassword = await bcrypt.hash(password, salt)
    user.password = hashedPassword
    user.save()
    res.status(200).json({
      message: 'Password Changed',
    })
  } catch (err) {
    res.status(403)
    throw new Error('Not authorized')
  }
})

// @desc    Get current user
// @route   GET /auth/user
// @access  Private
const user = asyncHandler(async (req, res) => {
  res.status(200).json({ user: req.user })
})

module.exports = {
  signup,
  resent,
  verify,
  login,
  refresh,
  logout,
  changePassword,
  resetPasswordLink,
  resetPassword,
  user,
}
