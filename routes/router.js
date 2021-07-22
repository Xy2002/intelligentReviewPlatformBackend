const Router = require('koa-router');

const user = require('./user');
const token = require('./token')
const project = require('./project')
const player = require('./player')

const router = new Router();

router.use('/apis/user', user);
router.use('/apis/token', token);
router.use('/apis/project',project)
router.use('/apis/player',player)


module.exports = router;
