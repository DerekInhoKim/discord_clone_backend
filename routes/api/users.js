const express = require('express');
const asyncHandler = require('express-async-handler');
const { check, validationResult } = require('express-validator');
const { User } = require('../../db/models')

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

router.post('/', email, firstName, lastName, userName, password, asyncHandler(async function (req, res, next){
  const errors = validationResult(req);
  if(!errors.isEmpty()) {
    return next({ status: 422, errors: errors.array() })

  }

  const user = await UserRepository.create(req.body);
  // console.log("user here", user)
  // const user = await User.build(req.body);
  // user.setPassword(req.body.password);

  const {jti, token} = generateToken(user);
  user.tokenId = jti;
  await user.save();
  await res.json({token, user: user.toSafeObject() })
  // return resJson()
}))

router.get('/me', authenticated, function(req, res) {
  res.json({
    firstName: req.user.Name,
    email: req.user.email,
  });
});

module.exports = router;
