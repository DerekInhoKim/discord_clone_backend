const router = require('express').Router();
const messageRouter = require('./messages')
const usersRouter = require('./users')

router.use('/users', usersRouter)
router.use('/messages', messageRouter)

module.exports = router;
