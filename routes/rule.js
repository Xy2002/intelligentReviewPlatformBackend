const Router = require('koa-router')
const db = require('../db/connect');
const router = new Router();
const {verifyToken} = require('../utils/token')
const to = require('await-to-js').default

router.post('/addRule', async (ctx) => {
    let req = ctx.request.body
    let {
        matchID,
        ruleName,
        maxScore,
        minScore,
        token
    } = {
        matchID: req.matchID,
        ruleName: req.ruleName,
        maxScore: req.maxScore,
        minScore: req.minScore,
        token: req.token
    }
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            let userID = result[0].id
            let query2 = `SELECT * FROM MatchInfo WHERE id = "${matchID}"`
            try {
                let res = await db.find(query2);
                if (res[0].creatorID !== userID) {
                    return ctx.sendError('101', "赛事创建者不是你！请不要越权操作。")
                } else {
                    let query = `INSERT INTO Rule(maxScore,minScore,ruleName,matchID) VALUES (?,?,?,?) `
                    try {
                        let result = await db.insert(query, [maxScore, minScore, ruleName, matchID])
                        console.log(result)
                        return ctx.send(result)
                    } catch (e) {
                        console.log(e)
                        return ctx.sendError('101', e)
                    }
                }
            } catch (e) {
                return ctx.sendError('101', e)
            }
        }).catch(err => {return ctx.sendError('101',"你不是本系统的用户，请不要试图越权操作！")})
    }
})

router.post('/getRuleList', async (ctx) => {
    let req = ctx.request.body
    let {
        matchID,
        token
    } = {
        matchID: req.matchID,
        token: req.token
    }
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            try {
                let query = `SELECT * From Rule WHERE MatchID=${matchID}`
                try {
                    let result = await db.find(query)
                    return ctx.send(result)
                } catch (e) {
                    console.log(e)
                    return ctx.sendError('101', e)
                }
            } catch (e) {
                return ctx.sendError('101', e)
            }
        }).catch(async err => {return ctx.sendError('101',"你不是本系统的用户，请不要试图越权操作！")})
    }
})

router.post('/updateRule', async (ctx) => {
    let req = ctx.request.body;
    console.log(req)
    let {
        matchID,
        maxScore,
        minScore,
        ruleName,
        token,
        id
    } = {
        matchID: req.matchID,
        maxScore: req.maxScore,
        minScore: req.minScore,
        ruleName: req.ruleName,
        token: req.token,
        id:req.id
    }
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            let userID = result[0].id
            let query2 = `SELECT * FROM MatchInfo WHERE id = "${matchID}"`
            try {
                let res = await db.find(query2);
                if (res[0].creatorID !== userID) {
                    return ctx.sendError('101', "赛事创建者不是你！请不要越权操作。")
                } else {
                    let query = `UPDATE Rule SET maxScore="${maxScore}",minScore="${minScore}",ruleName="${ruleName}" WHERE id="${id}"`
                    try {
                        let result = await db.update(query)
                        console.log(result)
                        return ctx.send(result)
                    } catch (e) {
                        console.log(e)
                        return ctx.sendError('101', e)
                    }
                }
            } catch (e) {
                return ctx.sendError('101', e)
            }
        }).catch(err => {return ctx.sendError('101',"你不是本系统的用户，请不要试图越权操作！")})
    }
})

router.post('/deleteRule', async (ctx) => {
    let req = ctx.request.body;
    console.log(req)
    let {
        id,
        matchID,
        token
    } = {
        id: req.id,
        matchID: req.matchID,
        token: req.token
    }
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            let userID = result[0].id
            let query2 = `SELECT * FROM MatchInfo WHERE id = "${matchID}"`
            try {
                let res = await db.find(query2);
                if (res[0].creatorID !== userID) {
                    return ctx.sendError('101', "赛事创建者不是你！请不要越权操作。")
                } else {
                    let query = `DELETE FROM Rule WHERE id="${id}"`
                    try {
                        let result = await db.delete(query)
                        console.log(result)
                        return ctx.send(result)
                    } catch (e) {
                        console.log(e)
                        return ctx.sendError('101', e)
                    }
                }
            } catch (e) {
                return ctx.sendError('101', e)
            }
        }).catch(err => {return ctx.sendError('101',"你不是本系统的用户，请不要试图越权操作！")})
    }
})

module.exports = router.routes();
