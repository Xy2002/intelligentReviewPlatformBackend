const Router = require('koa-router')
const db = require('../db/connect');
const router = new Router();
const {generateToken, verifyToken} = require('../utils/token')
const {getOpenId} = require('../utils/getOpenId')


router.post('/getToken', async (ctx) => {
    let req = ctx.request.body;
    console.log(req)
    let code = req.code;
    console.log(code)
    await getOpenId(code)
        .then(async (result) => {
            let res = JSON.parse(result)
            console.log(res)
            let openId = res.openid;
            let sessionKey = res.session_key
            let token = generateToken(openId,sessionKey)
            console.log(token)
            return ctx.loginsend(token, res);
        })
})

router.post('/tokenGetInfo', async (ctx) => {
    let req = ctx.request.body;
    let token = req.token;
    let openid = await verifyToken(token)
    console.log(openid)
})


module.exports = router.routes();
