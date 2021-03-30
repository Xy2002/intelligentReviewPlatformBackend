const Router = require('koa-router')
const router = new Router();
const {generateToken,verifyToken} = require('../utils/token')
const {getOpenId} = require('../utils/getOpenId')

router.post('/login',async (ctx)=>{
    let req = ctx.request.body;
    let code = req.code
    await getOpenId(code)
        .then(async (result)=>{
            let res = JSON.parse(result)
            console.log(res);
            let token = generateToken(res.openid)
            console.log(token)
            return ctx.loginsend(token);
        })
        .catch((err)=>{
            if(err) throw err;
        })
})

router.post('/register',async (ctx)=>{
    let req = ctx.request.body;
    let permissionLevel = req.perLev;
    await getOpenId(code)
        .then(async (result)=>{
            let res = JSON.parse(result)
            console.log(res);
            let token = generateToken(res.openid)
            console.log(token)
            return ctx.loginsend(token);
        })
        .catch((err)=>{
            if(err) throw err;
        })
})


module.exports=router.routes();
