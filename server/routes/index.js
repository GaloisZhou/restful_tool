"use strict";

var parse = require('co-body');
var route = require('koa-route');
var path = require('path');
var fs = require('fs');

var restService = require('../../module/service/restService');

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
    processHttpRequest,
];

// ------------------------------------------------------------------------------------------------------------------ //

function* processHttpRequest() {
    let _url = this.url;
    let _method = this.method;

    let _urlPath = _url.split('?')[0];
    let _query = this.query;


    console.log('-----------------------------------> 1');
    console.log('_urlPath', _urlPath);
    console.log('_query', _query);
    console.log('_method', _method);
    console.log('-----------------------------------> 2');

    let _restQuery = {
        urlPath: _urlPath,
        method: _method,
        isRemoved: false,
    };

    let _restData = yield restService.findOne(_restQuery);
    console.log('_restData', _restData);
    let _responseDemo = _restData && _restData.responseDemo || '';
    try {
        _responseDemo = _responseDemo ? JSON.parse(_responseDemo) : '';
        this.body = _responseDemo;
    } catch(e) {
        console.error(e);
        this.body = e;
    }
}
