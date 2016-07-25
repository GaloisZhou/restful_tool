"use strict";

var Dao = require('../utils/mongoDbUtils').Dao;

module.exports = new Dao(config.mongoDb.collections.adminUser, db);

let _demo = {
    _id: '',

    username: '',
    password: '',

    create_timestamp: '',
    update_timestamp: '',
};


// db.admin_user.insert({ username: 'galois', password: 'galois' });
// db.admin_user.insert({ username: 'saiman', password: 'saiman123456' });