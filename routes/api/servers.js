const express = require('express');
const asyncHandler = require('express-async-handler');
const { check } = require('express-validator');
const { User, Server, ServerUser } = require('../../db/models')
const { requireAuth } = require("../../auth");
const { handleValidationErrors } = require('./validations');

const router = express.Router();

router.use(requireAuth)

router.get('/:id(\\d+)', asyncHandler( async (req, res) => {
  const server = await Server.findByPk(req.params.id)
  res.json({ server })

}))

module.exports = router;
