"use strict";

var parse = require('co-body');
var route = require('koa-route');
var path = require('path');
var fs = require('fs');

var projectService = require('../../module/service/projectService');

function routePath(routePath) {
    return path.join('/project', routePath);
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
    route.get(routePath('/delete'), deleteProject),

    route.get(routePath('/detail'), detailPage),
    route.get(routePath('/module/add'), moduleAddPage),
    route.post(routePath('/module/add'), moduleAdd),
];

// ------------------------------------------------------------------------------------------------------------------ //

function* addPage() {
    let _id = this.query.id || '';
    let _projectData = yield projectService.findProjectById(_id);
    yield this.render('project/add', {projectData: _projectData || {}});
}

function* add() {
    let _body = yield parse(this);
    let _result = yield projectService.saveOrUpdateProjectById(_body);
    // TODO 判断处理结果
    this.redirect('/project/list');
}

function* listPage() {
    let _projects = yield projectService.findProject();
    yield this.render('project/list', {projects: _projects});
}

function* deleteProject() {
    let _id = this.query.id;
    let _removeResult = yield projectService.removeProjectById(_id);
    // TODO 判断删除结果
    console.log('_removeResult = ', _removeResult);
    this.redirect('/project/list');
}

function* detailPage() {
    let _id = this.query.id;
    let _projectData = yield projectService.findProjectById(_id);
    let _modules = yield projectService.findModule({projectId: _id});
    yield this.render('project/detail', {projectData: _projectData, modules: _modules});
}

function* moduleAddPage() {
    let _projectId = this.query.pi;
    let _moduleId = this.query.id;
    let _result = yield {
        projectData: projectService.findProjectById(_projectId),
        moduleData: projectService.findModuleById(_moduleId)
    };
    yield this.render('project/module/add', _result);
}

function* moduleAdd() {
    let _body = yield parse(this);
    console.log(_body);
    let _result = yield projectService.saveOrUpdateModuleById(_body);
    // TODO 判断处理结果
    console.log('moduleAdd: ', _result);
    this.redirect('/project/detail?id=' + _body.projectId);
}