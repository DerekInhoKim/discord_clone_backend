const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { User } = require('../../db/models')
const {requireAuth } = require('../../auth')
const { handleValidationErrors } = require('./validations');

const router = express.Router();


const sharedAuthValidations = [
  check("email")
    .exists({ checkFalsy: true })
    .isEmail()
    .withMessage("A valid email address is required")
    .isLength({ max: 100 })
    .withMessage("Email address must be less than 100 characters"),
  check("password")
    .exists({ checkFalsy: true })
    .withMessage("User password is required"),
];

//For user login
router.put("/", sharedAuthValidations, handleValidationErrors ,asyncHandler(async(req, res, next) => {
    const { email, password } = req.body;
    const user = await User.findOne(
      {
        where: { email }
      }
    );

    if (!user || !user.isValidPassword(password)) {
      const error = new Error("Invalid credentials");
      error.status = 401;
      error.title = "Invalid credentials";
      error.errors = ["Unable to authenticate provided information. Please check user name and/or password."];
      return next(error);
    }

    const token = getUserToken(user);
    res.json({
      token,
      user: {
        id: user.id,
        userName: user.userName,
        firstName: user.firstName,
        lastName: user.lastName,
        status: user.status,
        email: user.email
      }
    });
  })
);

router.delete('/', requireAuth, asyncHandler(async (req, res) => {
  req.user.tokenId = null;
  await req.user.save();
  res.json({message: 'user has been successfully deleted'})

}))

module.exports = router;
