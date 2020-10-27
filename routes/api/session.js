const express = require('express');
const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');

const UserRepository = require('../../db/user-repository');
const { authenticated, generateToken } = require('./security-utils');

const router = express.Router();

const email =
  check('email')
    .isEmail()
    .withMessage('Please provide a valid email address')
    .normalizeEmail();

const firstName =
  check('firstName')
    .not().isEmpty()
    .withMessage('Please provide a first name')

const lastName =
  check('lastName')
    .not().isEmpty()
    .withMessage('Please provide a last name')

const userName =
  check('userName')
    .not().isEmpty()
    .withMessage('Please provide a username')

const password =
  check('password')
    .not().isEmpty()
    .withMessage('Please provide a password')

router.put('/', [email, firstName, lastName, userName, password], asyncHandler( async (req, res, next) => {
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return next({status: 422, errors: errors.array() })
  }

  const {email, password} = req.body;
  const user = await UserRepository.findByEmail(email);

  if(!user.isValidPassword(password)) {
    const err = new Error('Login failed');
    err.status = 401;
    err.title = 'Login failed';
    err.errors = ['Invalid credentials'];
    return next(err)
  }

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
