"use strict";

var Dao = require('../utils/mongoDbUtils').Dao;

module.exports.project = new Dao(config.mongoDb.collections.project, db);
module.exports.projectModule = new Dao(config.mongoDb.collections.project_module, db);

let _demoProject = {
    _id: '',

    name: '', // 名称
    remark: '', // 说明

    create_timestamp: '',
    update_timestamp: '',
};


let _demoProjectModule = {
    _id: '',

    name: '', // 名称
    remark: '', // 说明

    projectId: '',// project._id

    create_timestamp: '',
    update_timestamp: '',
};


