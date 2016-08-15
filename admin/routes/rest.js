"use strict";

var parse = require('co-body');
var route = require('koa-route');
var path = require('path');
var fs = require('fs');

var restService = require('../../module/service/restService');
var projectService = require('../../module/service/projectService');

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
    route.get(routePath('/add/data'), addPageData),
    route.post(routePath('/add/data'), addData),

    route.get(routePath('/list'), listPage),
    route.get(routePath('/list/read_only'), listReadOnlyPage),
    route.get(routePath('/list/data'), listPageData),
    route.get(routePath('/delete'), deleteRest),
];

// ------------------------------------------------------------------------------------------------------------------ //

let _methods = ['GET', 'POST', 'PUT', 'DELETE'];
function* addPage() {
    let _id = this.query.id;
    yield this.render('rest/add', {id: _id});
}

function* addPageData() {
    let _id = this.query.id;
    let _result = yield  {
        restData: yield restService.findById(_id),
        projects: yield projectService.findProject(),
        modules: yield projectService.findModule(),
    };
    let _modules = {};
    if (_result.modules) {
        _result.modules.forEach(module => {
            _modules[module.projectId] = _modules[module.projectId] || [];
            _modules[module.projectId].push(module);
        });
    }
    _result.modules = _modules;

    _result.methods = _methods;
    this.body = _result;
}

function* addData() {
    let _body = yield parse(this);
    console.log('body', _body);

    let _result = yield restService.saveOrUpdateById(_body);
    // TODO 判断处理结果
    console.log('_result', _result);
    this.body = _result;
}

function* listPage() {
    yield this.render('rest/list', {});
}

function* listReadOnlyPage() {
    yield this.render('rest/list_readonly', {});
}

function* listPageData() {
    let _result = yield {
        restDatas: restService.find(),
        projects: projectService.findProject(),
        modules: projectService.findModule(),
    };
    let _restDatas = _result.restDatas;
    let _projects = _result.projects;
    let _modules = _result.modules;

    let _restObj = {};
    if (_restDatas) {
        _restDatas.forEach(rest => {
            _restObj[rest.projectId] = _restObj[rest.projectId] || {};
            _restObj[rest.projectId][rest.moduleId] = _restObj[rest.projectId][rest.moduleId] || [];
            _restObj[rest.projectId][rest.moduleId].push(rest);
        });
    }
    let _moduleObj = {};
    if (_modules) {
        _modules.forEach(module => {
            _moduleObj[module.projectId] = _moduleObj[module.projectId] || [];
            _moduleObj[module.projectId].push(module);
        });
    }
    this.body = {
        projects: _projects,
        moduleObj: _moduleObj,
        restObj: _restObj,
        serverDomain: config.domain.server
    };
}

function* deleteRest() {
    let _id = this.query.id;
    // yield restService.removeById(_id);
    // 不真的删除， 只是将 isRemoved = true
    yield restService.saveOrUpdateById({_id: _id, isRemoved: true});
    this.redirect('/rest/list');
}
