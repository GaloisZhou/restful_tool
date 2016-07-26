"use strict";

var service = {};

module.exports = service;


var projectDao = require('../dao/projectDao').project;
var moduleDao = require('../dao/projectDao').projectModule;


service.saveOrUpdateProjectById = function*(projectData) {
    let _result = {
        ok: false,
        _id: ''
    };
    let _id = projectData._id;
    if (_id) {
        _result._id = _id;
        _result.ok = yield projectDao.updateOne({
            _id: projectDao._id(_id)
        }, projectData);
    } else {
        let _insertResult = yield projectDao.insert(projectData);
        try {
            _result.ok = _insertResult.ok;
            _result._id = _insertResult.insertedIds[0];
        } catch (e) {
            console.error(e);
        }
    }
    return _result;
};

service.findProject = function*(query, sort, skip, limit, fields) {
    return yield projectDao.find(query, sort, skip, limit, fields);
};

service.findProjectById = function*(id) {
    return id ? yield projectDao.findOne({_id: projectDao._id(id)}) : null;
};

service.removeProjectById = function*(id) {
    return yield projectDao.remove({_id: projectDao._id(id)});
};


service.saveOrUpdateModuleById = function*(moduleData) {
    let _result = {
        ok: false,
        _id: ''
    };
    let _id = moduleData._id;
    if (_id) {
        _result._id = _id;
        _result.ok = yield moduleDao.updateOne({
            _id: moduleDao._id(_id)
        }, moduleData);
    } else {
        let _insertResult = yield moduleDao.insert(moduleData);
        try {
            _result.ok = _insertResult.ok;
            _result._id = _insertResult.insertedIds[0];
        } catch (e) {
            console.error(e);
        }
    }
    return _result;
};

service.findModule = function*(query, sort, skip, limit, fields) {
    return yield moduleDao.find(query, sort, skip, limit, fields);
};

service.findModuleById = function*(id) {
    return id ? yield moduleDao.findOne({_id: moduleDao._id(id)}) : null;
};

// ----------------------------------------------
