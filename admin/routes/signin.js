"use strict";

var parse = require('co-body');
var route = require('koa-route');
var path = require('path');
var fs = require('fs');

var userService = require('../../module/service/userService');

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
    route.get(routePath('/signin'), signinPage),
    route.post(routePath('/signin'), signin),
    route.get(routePath('/signout'), signout),
];

// ------------------------------------------------------------------------------------------------------------------ //

function* signinPage() {
    if (this.session && this.session.user) {
        this.redirect('/');
    } else {
        yield this.render('signin', {});
    }
}

function* signin() {
    let _body = yield parse(this);

    let _username = _body.username;
    let _password = _body.password;
    let _user = yield userService.findBySignin(_username, _password);

    if (_user && _user._id) {
        _user._id = _user._id + '';
        this.session.user = _user;

        this.redirect('/');
    } else {
        yield this.render('signin', _body);
    }
}

function* signout() {
    delete this.session.user;
    this.redirect('/signin');
}




