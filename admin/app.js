var app = require('koa')()
    , logger = require('koa-logger')
    , views = require('koa-views')
    , onerror = require('koa-onerror')
    , session = require('koa-session-redis')
    , mongoUtil = require('../module/utils/mongoDbUtils');


global.config = require('../module/conf/config');
// global.config = require('../module/conf/config_dev');

var KoaRoute = require('../module/utils/KoaRoute'),
    _router = new KoaRoute(app);


// global middlewares
app.use(views(__dirname + '/views', {
    map: {html: 'swig'}
}));

app.use(logger());
app.keys = ['saimankeji'];
app.use(session({store: config.redisDb.session, key: config.redisDb.session.key}));

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


    _router.initRouter(require('./routes/signin'));

    app.use(function*(next) {
        if (this.session && this.session.user) {
            yield next;
        } else {
            this.redirect('/signin');
        }
    });

    _router.initRouter(require('./routes/index'));
    _router.initRouter(require('./routes/rest'));

});

app.on('error', function (err, ctx) {
    console.error('server error', err, ctx);
});

module.exports = app;
