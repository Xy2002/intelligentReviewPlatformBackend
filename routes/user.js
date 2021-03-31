const Router = require('koa-router')
const db = require('../db/connect');
const router = new Router();
const {generateToken,verifyToken} = require('../utils/token')
const {getOpenId} = require('../utils/getOpenId')

router.post('/login',async (ctx)=>{
    let req = ctx.request.body;
    let token = req.token;
    await verifyToken(token)
        .then(async (result)=>{

        })
})

router.post('/register',async (ctx)=>{
    let req = ctx.request.body;
    let{
        username,
        phone,
        email,
        code,
        power
    }={
        username:req.username,
        phone:req.phone,
        email:req.email,
        code:req.code,
        power:req.power
    }
    await getOpenId(code)
        .then(async (result)=>{
            let res = JSON.parse(result)
            let openId = res.openid;
            let token = generateToken(username,phone,email)
            let obj = new Object();
            obj.token = token;
            obj.power = power;
            obj.openId = openId;
            return new Promise(resolve => {
                resolve(obj)
            })
        }).then(async (obj)=>{
            let{
                token,
                power,
                openId
            }={
                token:obj.token,
                power:obj.power,
                openId:obj.openId,
            }
            let query = `INSERT INTO mini_program(token,power,openId) VALUES(?,?,?)`
            await db.insert(query,[token,power,openId])
                .then(async (result)=>{
                    return await ctx.send(result);
                })
            }
        )
        .catch((err)=>{
            return ctx.sendError('101', err.message);
        })
})


module.exports=router.routes();
