var app = require('koa')()
    , logger = require('koa-logger')
    , views = require('koa-views')
    , onerror = require('koa-onerror')
    , session = require('koa-session-redis')
    , config = require('../module/conf/config')
    , mongoUtil = require('../module/utils/mongoDbUtils');

global.config = config;

var KoaRoute = require('../module/utils/KoaRoute'),
    _router = new KoaRoute(app);


// global middlewares
app.use(views(__dirname + '/views', {
    map: {html: 'swig'}
}));

app.use(logger());
app.keys = ['saimankejiserver'];
app.use(session({store: config.redisDb.session}));

app.use(require('koa-static')(__dirname + '/public'));

app.use(function *(next) {
    console.log('request ..... session ....', this.session);
    var start = new Date;
    yield next;
    var ms = new Date - start;
    console.log('%s %s - %s', this.method, this.url, ms);
});

mongoUtil.init(config.mongoDb)(function (err, db) {
    global.db = db;

    _router.initRouter(require('./routes/index'));

});

app.on('error', function (err, ctx) {
    logger.error('server error', err, ctx);
});

module.exports = app;
