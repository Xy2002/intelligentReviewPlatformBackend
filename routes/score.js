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

router.post('/getMyScore', async (ctx)=>{
    let req = ctx.request.body
    let {
        token
    } = {
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
                    let query4 = `select projectID from MatchData where userID="${userID}"`
                    let result2 = await db.find(query4)
                    let tempArr = []
                    result2.forEach(function (item) {
                        tempArr.push(item.projectID)
                    })
                    Array.prototype.method1 = function(){
                        var arr=[];    //定义一个临时数组
                        for(var i = 0; i < this.length; i++){    //循环遍历当前数组
                            //判断当前数组下标为i的元素是否已经保存到临时数组
                            //如果已保存，则跳过，否则将此元素保存到临时数组中
                            if(arr.indexOf(this[i]) == -1){
                                arr.push(this[i]);
                            }
                        }
                        return arr;
                    }
                    let Arr = tempArr.method1()
                    let resArr
                    let tempArr2 = []
                    for (const item of Arr) {
                        let query = `select matchID from Project where id=${item}`
                        let tempRes = await db.find(query)
                        tempArr2.push(tempRes[0].matchID)
                    }
                    resArr = tempArr2.method1()
                    return ctx.send(resArr)
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
module.exports = router.routes();
