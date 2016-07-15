"use strict";

var parse = require('co-body');
var route = require('koa-route');
var path = require('path');
var fs = require('fs');

var restService = require('../../module/service/restService');

function routePath(routePath) {
    return path.join('/rest', routePath);
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
    route.get(routePath('/add'), addPage),
    route.post(routePath('/add'), add),

    route.get(routePath('/list'), listPage),
    route.get(routePath('/delete'), deleteDest),
];

// ------------------------------------------------------------------------------------------------------------------ //

let _methods = ['GET', 'POST', 'PUT', 'DELETE'];
function* addPage() {
    try {
        let _id = this.query.id;
        console.log('_id', _id);
        let _restData = yield restService.findById(_id);
        console.log('_restData: ', _restData);
        yield this.render('rest/add', {methods: _methods, restData: _restData});
    } catch (e) {
        console.error(e);
    }
}

function* add() {
    let _body = yield parse(this);
    console.log('body', _body);

    try {
        let _result = yield restService.saveOrUpdateById(_body);
        if (_result.ok) {
            this.redirect('/rest/list');
        } else {
            if (_result._id) {
                _body._id = _result._id;
            }
            yield this.render('rest/add', {methods: _methods, restData: _body, errMsg: _result.errMsg || ''});
        }
    } catch(e) {
        console.error(e);
        yield this.render('rest/add', {methods: _methods, restData: _body, errMsg: e});
    }
}

function* listPage() {
    let _restDatas = yield restService.find();
    console.log('_restDatas', _restDatas);
    yield this.render('rest/list', {restDatas: _restDatas});
}

function* deleteDest() {
    let _id = this.query.id;
    // yield restService.removeById(_id);
    // 不真的删除， 只是将 isRemoved = true
    yield restService.saveOrUpdateById({_id: _id, isRemoved: true});
    this.redirect('/rest/list');
}
