const Router = require('koa-router');

const user = require('./user');
const token = require('./token')

const router = new Router();

router.use('/apis/user', user);
router.use('/apis/token', token);

module.exports = router;
