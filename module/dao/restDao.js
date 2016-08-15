"use strict";

var Dao = require('../utils/mongoDbUtils').Dao;

module.exports = new Dao(config.mongoDb.collections.restApi, db);

let _demo = {
    _id: '',

    projectId: '',
    moduleId: '',

    title: '', // 接口名称
    remark: '', // 接口说明

    wikiUrl: '', // wiki 地址
    urlPathDefine: '',
    method: '', // GET, POST, PUT, DELETE
    requestParams: [
        {
            key: '',
            required: true, // 是否是必须的
            type: 'number', // 类型
            remark: '', // 说明
        }
    ],
    responseData: [
        {
            key: '',
            type: 'number', // 类型
            remark: '', // 说明
        }
    ],
    urlPath: '', // demo
    requestDemo: '',
    responseDemo: '',

    isRemoved: false,

    create_timestamp: '',
    update_timestamp: '',
};


// db.admin_user.insert({ username: 'galois', password: 'galois' });
// db.admin_user.insert({ username: 'test01', password: 'test01' });
