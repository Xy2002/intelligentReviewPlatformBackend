const Router = require('koa-router');

const user = require('./user');
const token = require('./token')
const project = require('./project')

const router = new Router();

router.use('/apis/user', user);
router.use('/apis/token', token);
router.use('/apis/project',project)

module.exports = router;
