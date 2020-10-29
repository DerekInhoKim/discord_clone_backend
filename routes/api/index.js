const router = require('express').Router();
const messageRouter = require('./messages')
const usersRouter = require('./users')
const sessionRouter = require('./session')
const serverRouter = require('./servers')

router.use('/servers', serverRouter)
router.use('/users', usersRouter)
router.use('/messages', messageRouter)
router.use('/session', sessionRouter)


module.exports = router;
