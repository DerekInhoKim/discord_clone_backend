const express = require('express');
const asyncHandler = require('express-async-handler');
const { User, Server, ServerUser } = require('../../db/models')
const { requireAuth } = require("../../auth");
const { handleValidationErrors } = require('./validations');
const router = express.Router()

router.use(requireAuth)

router.post('/', asyncHandler( async (req, res)=> {
  const {userId, serverId} = req.body
  await ServerUser.create({userId, serverId})
  res.json({message: 'ServerUser connection has been completed!'})
}))

module.exports = router;
