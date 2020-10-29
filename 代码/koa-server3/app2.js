const Koa = require('koa');
const KoaRouter = require('koa-router');
const KoaStaticCache = require('koa-static-cache');
const template = require('./middlewares/tpl');

const mysql = require('mysql2/promise');;



// 在node中使用require加载一个json文件数据的话，node会自动转成对象
const datas = require('./data/data.json');
// 类似下面一行代码
// let content = JSON.parse(fs.readFileSync('./data/data.json'));

//自执行函数
let connection;
~async function() {
    // console.log('123')
    // 连接数据库
    connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'chy110',
        database: 'user'
    });

    // // 数据库查询
    // const [rows, fields] = await connection.execute('SELECT * FROM `datas`', []);
    // console.log('rows', rows);

    // 插入数据
    // for (let i=0; i<datas.length; i++) {
    //     await connection.execute('insert into `datas` (`title`, `imgUrl`, `from`, `newTime`) values (?, ?, ?, ?)', [
    //         datas[i].title,
    //         datas[i].imgUrl,
    //         datas[i].from,
    //         datas[i].newTime
    //     ]);
    // }
    
}()

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




router.get('/addUser', async ctx=> {
    let username1,age1;
    let data = ctx.querystring;
    let result = data.split('&');
    result.forEach(item => {
        let res = item.split('=');
        if(res[0] == 'username'){
            username1 = res[1];
        }
        if(res[0] == 'age'){
            age1 = Number(res[1]);
        }
    })

    await connection.execute('insert into `userdata` (`username`,`age`) values (?,?)', [username1, age1])
})



// 把router对象的routes中间件注册到Koa中
server.use( router.routes() );


// 启动服务，并监听指定的端口
server.listen(8081, () => {
    console.log('服务启动成功，http://localhost:8081');
});