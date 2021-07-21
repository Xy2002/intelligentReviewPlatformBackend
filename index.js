const koa = require('koa');
const koa_bodyparser = require('koa-bodyparser');
const cors = require('koa2-cors');
const https = require('https')
const fs = require('fs')
const router = require('./routes/router.js')
const errorHandle = require('./middlewares/errorHandle.js'),
    sendHandle = require('./middlewares/sendHandle.js');

const app = new koa();
const options= {
 key:fs.readFileSync('./ssl/naiquoy.com.key'),
 cert:fs.readFileSync('./ssl/naiquoy.com.pem')
}
app.use(cors())
app.use(koa_bodyparser())
app.use(sendHandle());
app.use(errorHandle);

app.use(router.routes())
app.use(router.allowedMethods())


app.listen(20000, () => {
 console.log("server已启动");
})

https.createServer(options,app.callback()).listen(20001,()=>{
 console.log("server running success at 20001")
});
