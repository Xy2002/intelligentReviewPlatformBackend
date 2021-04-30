const Router = require('koa-router')
const db = require('../db/connect');
const router = new Router();
const {generateToken, verifyToken} = require('../utils/token')
const {getOpenId} = require('../utils/getOpenId')


router.post('/getToken', async (ctx) => {
    let req = ctx.request.body;
    let code = req.code;
    await getOpenId(code)
        .then(async (result) => {
            let res = JSON.parse(result)
            let openId = res.openid;
            let token = generateToken(openId)
            console.log(token)
            return ctx.loginsend(token);
        })
})

router.post('/tokenGetInfo', async (ctx) => {
    let req = ctx.request.body;
    let token = req.token;
    let openid = await verifyToken(token)
    console.log(openid)
})


module.exports = router.routes();
