"use strict";

var service = {};

module.exports = service;


var userDao = require('../dao/userDao');

service.findOne = function*(query, options) {
    return yield userDao.findOne(query, options);
};

service.findBySignin = function*(username, password) {
    return yield userDao.findOne({username: username, password: password});
};

