const router = require('express').Router();
const messageRouter = require('./messages')
const usersRouter = require('./users')
const sessionRouter = require('./session')
const serverRouter = require('./servers')
const serverUsersRouter = require('./serverusers')
const channelsRouter = require('./channels')

router.use('/serverUsers', serverUsersRouter)
router.use('/servers', serverRouter)
router.use('/users', usersRouter)
router.use('/messages', messageRouter)
router.use('/session', sessionRouter)
router.use('/channels', channelsRouter)


module.exports = router;
