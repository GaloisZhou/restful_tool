"use strict";

var parse = require('co-body');
var route = require('koa-route');
var path = require('path');
var fs = require('fs');

function routePath(routePath) {
    return path.join('/', routePath);
}

function concatObj(obj1, obj2) {
    if (obj1 && obj2) {
        for (var i in obj2) {
            obj1[i] = obj2[i];
        }
        return obj1;
    } else if (obj1) {
        return obj1;
    } else {
        return obj2;
    }
}

module.exports = [
    route.get(routePath('/'), index),
];

// ------------------------------------------------------------------------------------------------------------------ //

function* index() {
    yield this.render('index', {});
}
