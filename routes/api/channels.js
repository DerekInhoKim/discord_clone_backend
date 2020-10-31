const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { requireAuth } = require('../../auth');
const { Channel, Message, User } = require('../../db/models');

router.use(requireAuth)

//Returns information on a requested channel
router.get('/:id(\\d+)', asyncHandler(async (req, res) => {
  const channelId = req.params.id
  const channel = await Channel.findByPk(channelId)

  res.json({channel})
}))

router.get('/:id(\\d+)/messages', asyncHandler( async (req, res ) => {
  const channelId = req.params.id
  const channel = await Channel.findByPk(channelId, {
    include: {model: Message, include: User}
  })

  res.json(channel)
}))

module.exports = router;
