const express = require('express')
const router = express.Router()
const {
  signup,
  resent,
  verify,
  login,
  refresh,
  logout,
  changePassword,
  resetPasswordLink,
  resetPassword,
} = require('../controllers/authController')
const { protected } = require('../middleware/authMiddleware')

router.post('/signup', signup)
router.post('/resent', resent)
router.post('/verify', verify)
router.post('/login', login)
router.post('/refresh', refresh)
router.post('/logout', logout)
router.post('/changepassword', protected, changePassword)
router.post('/resetpasswordlink', resetPasswordLink)
router.post('/resetpassword', resetPassword)

module.exports = router
