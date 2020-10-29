const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaStaticCache = require('koa-static-cache');
const template = require('./middlewares/tpl');

// 在node中使用require加载一个json文件数据的话，node会自动转成对象
const datas = require('./data/data.json');
// 类似下面一行代码
// let content = JSON.parse(fs.readFileSync('./data/data.json'));

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

// 注册我们自己写的一个基于nunjucks的一个模板引擎中间件
server.use( template('views') );

// 首页，当一个url上的可选动态数据多的时候，用动态路由比较麻烦，就像一个函数如果参数多了，用一个一个的形参比较麻烦，这个情况下用 options 对象传参更方便
// url，动态数据少可以使用动态路由
// url，动态数据多使用 queryString
router.get('/', ctx => {
    // 把data和index.html经过模板引擎渲染得到最终的html字符串，返回给客户端

    // 分页
   

    // 每页显示多少
    let prepage = 5;
    // 当前显示那一页
     // console.log(ctx.query);
    let page = ctx.query.page || 1;
    page = Number(page);
    // console.log(page);
    // 根据datas.length和prepage计算总页数
    let pages = Math.ceil(datas.length / prepage);
    
    // 当前要显示的数据的起始下标和结束下标
    let start = (page - 1) * prepage;
    let end = start + prepage;

    let showDatas = datas.slice(start, end);

    ctx.render('index.html', {
        datas: showDatas,
        pages,
        page
    });
});

// 详情页
// 我们可以通过许多种方式在请求的时候携带数据
// 请求头，url(路径上，queryString)，请求正文，
router.get('/detail/:id(\\d+)', ctx => {
    // 
    // console.log(ctx.params);
    let id = Number(ctx.params.id);

    // 根据id去获取数据
    let data = datas.find( d => d.id == id );

    if (!data) {
        // return ctx.render('404');
    }

    // console.log('data', data);

    ctx.render('detail.html', {
        data
    });
})


// 把router对象的routes中间件注册到Koa中
server.use( router.routes() );


// 启动服务，并监听指定的端口
server.listen(8081, () => {
    console.log('服务启动成功，http://localhost:8081');
});