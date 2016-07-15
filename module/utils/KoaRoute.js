"use strict";

module.exports = class KoaRoute {

    constructor(app) {
        this.app = app;
    }

    initRouter(router) {
        router && router instanceof Array && router.forEach((_r) => {
            this.app.use(_r);
        });
    }
};
