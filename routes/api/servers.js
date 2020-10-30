const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { User, Server, ServerUser } = require('../../db/models')
const { requireAuth } = require("../../auth");
const { handleValidationErrors } = require('./validations');

const router = express.Router();

router.use(requireAuth)

//returns a server with the specified id
router.get('/:id(\\d+)', asyncHandler( async (req, res) => {
  const server = await Server.findByPk(req.params.id)
  res.json({ server })

}))

//Creates a new server and associates the user and server with ServerUser
router.post('/', asyncHandler(async (req, res) => {
  const userId = localStorage.getItem("USER_ID")
  const { serverName } = req.body
  const server = await Server.create({ serverName })
  const serverId = server.id

  const serverUser = await ServerUser.create({ userId, serverId })
  res.json({serverUser})

}))

router.delete('/:id(\\d+)', asyncHandler( async (req, res) => {
  const serverId = req.params.id
  const server = await Server.findByPk(serverId)
  server.destroy()
}))

module.exports = router;
