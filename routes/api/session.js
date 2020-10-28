const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');


const UserRepository = require('../../db/user-repository');
const { authenticated, generateToken } = require('./security-utils');
const { handleValidationErrors } = require('./validations');

const router = express.Router();


const updateUserValidators = [
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail(),
  check('firstName')
    .not().isEmpty()
    .withMessage('Please provide a first name'),
  check('lastName')
    .not().isEmpty()
    .withMessage('Please provide a last name'),
  check('userName')
    .not().isEmpty()
    .withMessage('Please provide a username'),
  check('password')
    .not().isEmpty()
    .withMessage('Please provide a password')
]

router.put('/', updateUserValidators, handleValidationErrors ,asyncHandler( async (req, res, next) => {
  const {email} = req.body;
  const user = await UserRepository.findByEmail(email);

  const {jti, token} = generateToken(user)
  user.tokenId = jti;
  await user.save();
  res.json({ token, user: user.toSafeObject() })

}))

router.delete('/', [authenticated], asyncHandler(async (req, res) => {
  req.user.tokenId = null;
  await req.user.save();
  req.json({message: 'user has been successfully deleted'})

}))

module.exports = router;
