const sendHandle = () => {
    const render = ctx => {
        return (data, msg = '请求成功') => {
            ctx.set('Content-Type', 'application/json');
            ctx.body = {
                code: '200',
                data,
                msg
            }
        }
    }

    const loginrender = ctx => {
        return (data, msg = '登录成功') => {
            ctx.set('Content-Type', 'application/json');
            ctx.body = {
                code: 100,
                msg: msg,
                info: data
            }
        }
    }

    const renderError = ctx => {
        return (code, msg = '请求失败') => {
            ctx.set('Content-Type', 'application/json');
            ctx.body = {
                code,
                msg
            }
        }
    }

    return async (ctx, next) => {
        ctx.loginsend = loginrender(ctx);
        ctx.send = render(ctx);
        ctx.sendError = renderError(ctx);
        await next();
    }
}

module.exports = sendHandle;