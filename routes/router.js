const Router = require('koa-router');

const user = require('./user');

const router = new Router();

router.use('/apis/user', user);

module.exports = router;
