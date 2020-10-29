const nunjucks = require('nunjucks');



module.exports = function(dir) {
    const tpl = new nunjucks.Environment(
        // 模板存放路径，内部自动加入 __dirname
        new nunjucks.FileSystemLoader(
            dir,
            {
                watch: true,
                noCache: true
            }
        )
    );

    return function(ctx, next) {
    
        ctx.render = function(filename, data) {
            let content = tpl.render(filename, data);
            ctx.body = content;
        }
    
        next();
    }
}