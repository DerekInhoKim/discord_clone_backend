const express = require('express');
const bcrypt = require('bcryptjs')
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { User, Server, ServerUser } = require('../../db/models')
const { getUserToken, requireAuth } = require("../../auth");
const { handleValidationErrors } = require('./validations');
const router = express.Router();

const userNotFoundError = (id) => {
  const err = Error('User not found');
  err.errors = [`User with the id of ${id} could not be found`];
  err.title = 'User not found';
  err.status = 404;
  return err;
};

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
    .withMessage('Please provide a password'),
  check("confirmPassword")
    .not().isEmpty()
    .withMessage("Please confirm your password")
    .custom((value, { req }) => value === req.body.password)
    .withMessage("Password field does not match password."),
]


//Creates a new user in the database after validations.
router.post("/", userCreationValidators, handleValidationErrors ,asyncHandler(async(req, res) => {
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

    res.status(201).json({ user: { id: user.id }, token });
  })
);

//Return information for a user with id
router.get('/:id(\\d+)', requireAuth, asyncHandler( async (req, res) => {
  const user = await User.findByPk(req.params.id)
  res.json({user})

}))

//Removes a user from the database with the appropriate id
router.delete('/:id(\\d+)', requireAuth ,asyncHandler (async (req, res) => {
  const user = await User.findByPk(req.params.id)

  if(user){
    await user.destroy()
    res.json({message: `User id = ${req.params.id} has been deleted!`})
  } else {
    next(userNotFoundError(req.params.id))
  }
}))

//Return all servers that a user belongs to
router.get('/:id(\\d+)/servers', requireAuth, asyncHandler( async(req, res) => {
  const servers = await ServerUser.findAll({where: {
    userId: req.params.id
  }, include: Server
  })

  res.json({servers})

}))

const serverNameValidator = [
  check('serverName')
    .not().isEmpty()
    .withMessage('Please provide a server name'),
]

router.post('/:id(\\d+)/servers', requireAuth, serverNameValidator, handleValidationErrors, asyncHandler( async(req, res) => {
  const { serverName } = req.body
  const server = await Server.create({ serverName })
  res.status(201).json({ server })
}))


module.exports = router;
