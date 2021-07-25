const Router = require('koa-router')
const db = require('../db/connect');
const router = new Router();
const {verifyToken} = require('../utils/token')
const to = require('await-to-js').default

router.post('/addScore', async (ctx) => {
    let req = ctx.request.body
    let {
        projectID,
        score,
        matchID,
        token,
        ruleID
    } = {
        projectID: req.projectID,
        score: req.score,
        matchID: req.matchID,
        token: req.token,
        ruleID: req.ruleID
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
                res = res[0]
                if (res.status === 1) {
                    return ctx.sendError('102', "比赛已结束")
                } else {
                    let query3 = `SELECT * FROM Rule WHERE id = "${ruleID}"`
                    let query4 = `SELECT * FROM MatchData WHERE ruleID = "${ruleID}" and userID = "${userID}" and projectID = "${projectID}"`
                    let res2 = await db.find(query3)
                    let res3 = await db.find(query4)
                    res2 = res2[0]
                    console.log(res3.length)
                    if (score > res2.maxScore || score < res2.minScore || res3.length !== 0) {
                        // if(res3.length!==0){
                        //     let query5 = `DELETE FROM MatchData WHERE  userID = "${userID}" and projectID = "${projectID}"`
                        //     await db.delete(query5)
                        // }
                        return ctx.sendError('101', "非法分数或已进行过评分")
                    } else {
                        let query4 = `INSERT INTO MatchData(score,projectID,userID,ruleID) VALUES (?,?,?,?) `
                        let res3 = await db.insert(query4, [score, projectID, userID, ruleID])
                        return await ctx.send(res3)
                    }
                }
            } catch (e) {
                return ctx.sendError('101', e.message)
            }
        }).catch(err => {
            return ctx.sendError('101', "你不是本系统的用户，请不要试图越权操作！")
        })
    }
})

router.post('/getWaitScoreList', async (ctx) => {
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
                let userID = result[0].id
                try {
                    let query4 = `select * from Project where id not in (select projectID from MatchData where userID = "${userID}") and matchID="${matchID}"`
                    let result2 = await db.find(query4)
                    return ctx.send(result2)
                } catch (e) {
                    console.log(e)
                    return ctx.sendError('101', e.message)
                }
            } catch (e) {
                return ctx.sendError('101', e.message)
            }
        }).catch(async err => {
            return ctx.sendError('101', "你不是本系统的用户，请不要试图越权操作！")
        })
    }
})

router.post('/getAlreadyScoreList', async (ctx) => {
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
                let userID = result[0].id
                try {
                    let query4 = `select * from Project where id in (select projectID from MatchData where userID = "${userID}") and matchID="${matchID}"`
                    let result2 = await db.find(query4)
                    return ctx.send(result2)
                } catch (e) {
                    return ctx.sendError('101', e.message)
                }
            } catch (e) {
                return ctx.sendError('101', e.message)
            }
        }).catch(async err => {
            return ctx.sendError('101', "你不是本系统的用户，请不要试图越权操作！")
        })
    }
})

router.post('/getScore', async (ctx) => {
    let req = ctx.request.body
    let {
        projectID,
        token
    } = {
        projectID: req.projectID,
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
                let userID = result[0].id
                try {
                    let query4 = `select * from Rule LEFT JOIN MatchData on Rule.id = MatchData.ruleID WHERE projectID="${projectID}" and userID="${userID}"`
                    let result2 = await db.find(query4)
                    return ctx.send(result2)
                } catch (e) {
                    return ctx.sendError('101', e.message)
                }
            } catch (e) {
                return ctx.sendError('101', e.message)
            }
        }).catch(async err => {
            return ctx.sendError('101', "你不是本系统的用户，请不要试图越权操作！")
        })
    }
})

router.post('/updateScore', async (ctx) => {
    let req = ctx.request.body
    let {
        projectID,
        score,
        matchID,
        token,
        ruleID
    } = {
        projectID: req.projectID,
        score: req.score,
        matchID: req.matchID,
        token: req.token,
        ruleID: req.ruleID
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
                res = res[0]
                if (res.status === 1) {
                    return ctx.sendError('102', "比赛已结束")
                } else {
                    let query=`UPDATE MatchData SET score=${score} WHERE ruleID = "${ruleID}" and userID = "${userID}" and projectID = "${projectID}"`
                    let result = await db.update(query)
                    return ctx.send(result)
                }
            } catch (e) {
                return ctx.sendError('101', e.message)
            }
        }).catch(err => {
            return ctx.sendError('101', "你不是本系统的用户，请不要试图越权操作！")
        })
    }
})

router.post('/getMatchScore', async (ctx)=>{
    let req = ctx.request.body;
    let {
        code,
        token
    } = {
        code: req.code,
        token: req.token
    }
    // console.log(code)
    const [err, res] = await to(verifyToken(token))
    if (err) {
        return ctx.sendError('100', 'token已过期，请重新生成')
    } else {
        let openid = res.openid
        let query = `SELECT id FROM User WHERE openid = "${openid}"`
        await db.find(query).then(async result => {
            let query2 = `SELECT * FROM MatchInfo WHERE code = "${code}"`
            try {
                let result1 = await db.find(query2)
                if(result1.length === 0){
                    return ctx.sendError("101","该比赛不存在")
                }
                // console.log(JSON.parse(result1[0].matchOptions))
                let isReadRank = JSON.parse(result1[0].matchOptions).readRank
                let creatorID = result1[0].creatorID
                // console.log(isReadRank,creatorID)
                let flag
                if(isReadRank){
                    flag = true
                }else{
                    flag = creatorID === result[0].id;
                }
                if(flag===true){
                    let matchID = result1[0].id
                    let query3 = `select * from MatchData where projectID in (select id from Project where matchID="${matchID}")`
                    let res3 = await db.find(query3)
                    for (const item of res3) {
                        let query4 = `select playerName from Project where id="${item.projectID}"`
                        let res4 = await db.find(query4)
                        item.playerName = res4[0].playerName
                    }
                    return ctx.send(res3)
                }else{
                    return ctx.sendError('101',"无权进行此操作")
                }
            } catch (e) {
                console.log(e)
                return ctx.sendError('101', e.message)
            }
        })
            .catch(async err => {
                return ctx.sendError('101', '未在数据库查找到相关记录')
            })
    }
})

module.exports = router.routes();
