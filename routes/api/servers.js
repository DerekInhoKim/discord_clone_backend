const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { User, Server, ServerUser, Channel } = require('../../db/models')
const { requireAuth } = require("../../auth");
const { handleValidationErrors } = require('./validations');

const router = express.Router();

router.use(requireAuth)

//returns a server with the specified id
router.get('/:id(\\d+)', asyncHandler( async (req, res) => {
  const server = await Server.findByPk(req.params.id)
  res.json({ server })

}))

//Creates a new server returns that server's information to be used to create the connection for the ServerUser join table.
//Implement a ServerUser.create
router.post('/', asyncHandler(async (req, res) => {
  const { serverName } = req.body
  const server = await Server.create({ serverName })

  res.json({server})
}))

//Removes the server from the database
router.delete('/:id(\\d+)', asyncHandler( async (req, res) => {
  const serverId = req.params.id
  const server = await Server.findByPk(serverId)
  server.destroy()

}))

//Returns an object with the channels key, which has a value of an array of channels that belong to a server
router.get('/:id(\\d+)/channels', asyncHandler (async (req, res) => {
  const serverId = req.params.id
  const channels = await Channel.findAll({
    where: {
      serverId: serverId
    }
  })
  res.json(channels)

}))

module.exports = router;
