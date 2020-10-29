const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaStaticCache = require('koa-static-cache');

// 创建 server 对象
const server = new Koa();

// 创建静态文件代理服务
server.use( KoaStaticCache('./public', {
    prefix: '/public',
    gzip: true,
    dynamic: true
}) );

// 除了上面以 /public 开头的url，其它都会走下面router进行处理
// 创建动态资源（使用router来为动态资源做映射）
// 创建一个router对象
const router = new KoaRouter();

// 用 router 来注册各种需要用到的url资源处理函数
router.get('/', ctx => {
    ctx.body = 'Hello';
});

// 练习
router.get('/getData', ctx => {
    // 不是合法的json格式
    // ctx.body = "{'name': 'koa'}";
    // 必须是双引号
    // ctx.set('Content-Type', 'application/json;charset=utf-8');
    // ctx.body = '{"name": "koa"}';

    // koa 框架内部帮助我们做了一些处理，如果你给body设置一个对象，那么koa内部会把这个对象转成json以后再发送，同时设置头信息application/json;charset=utf-8
    ctx.body = {name: 'koa'};

    // ctx.type = 'application/json;charset=utf-8';
    // 等同下面的代码
    // ctx.set('Content-Type', 'application/json;charset=utf-8');
});


// 把router对象的routes中间件注册到Koa中
server.use( router.routes() );


// 启动服务，并监听指定的端口
server.listen(8081, () => {
    console.log('服务启动成功，http://localhost:8081');
});