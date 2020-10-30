const express = require('express');
const router = express.Router();
const asyncHandler = require('express-async-handler');
const { requireAuth } = require('../../auth');
const { Message } = require('../../db/models');

router.use(requireAuth)

router.post("/",asyncHandler( async (req, res, next) => {
  const {message, userId, channelId} = req.body
  const newMessage = await Message.create({message, userId, channelId})
  res.json({ newMessage })
}))

module.exports = router;
