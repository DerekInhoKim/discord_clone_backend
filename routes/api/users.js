const express = require('express');
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { User } = require('../../db/models')
const { getUserToken } = require("../../auth");
// const { authenticated, generateToken } = require('./security-utils');
const { handleValidationErrors } = require('./validations');

const router = express.Router();

const userCreationValidators = [
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

//For when a new user is registered
router.post("/", userCreationValidators, handleValidationErrors, asyncHandler(async(req, res) => {
    const { firstName, lastName, userName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ firstName, lastName, userName, email, hashedPassword })
    const token = getUserToken(user) // Creates and attaches token to new user
    res.status(201).json({
      user: { id: user.id },
      token,
    });
}));

//Also for when a new user is registered? Better because checks password.

router.post("/token",
  userCreationValidators,
  check("confirmPassword")
    .not().isEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password field does not match password."),
  handleValidationErrors,
  asyncHandler(async(req, res) => {
    const {
      userName,
      firstName,
      lastName,
      email,
      password,
    } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.build(
      {
        firstName,
        lastName,
        userName,
        email,
        hashedPassword,
      }
      );

    const token = await getUserToken(user);
    user.tokenId = token;
    await user.save();

    res.status(201).json({
      user: { id: user.id },
      token
    });
  })
);



module.exports = router;
