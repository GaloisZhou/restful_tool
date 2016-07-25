"use strict";

var service = {};

module.exports = service;


var restDao = require('../dao/restDao');

service.findOne = function*(query, options) {
    return yield restDao.findOne(query, options);
};

service.findById = function*(id) {
    if (id) {
        console.log('{_id: restDao._id(id)}', {
            _id: restDao._id(id)
        });
        return yield service.findOne({
            _id: restDao._id(id)
        });
    } else {
        return null;
    }
};

service.find = function*(query, sort, skip, limit, fields) {
    sort = sort || {
        create_timestamp: 1
    };
    query = query || {};
    query.isRemoved = false;
    return yield restDao.find(query, sort, skip, limit, fields);
};

service.saveOrUpdateById = function*(restData) {
    let _result = {
        ok: false,
        _id: ''
    };
    let _id = restData._id || '';
    delete restData._id;
    // ------------- 不能重复
    let _restQuery = {
        urlPath: restData.urlPath,
        method: restData.method,
        isRemoved: false
    };

    let _existedRestData = yield service.findOne(_restQuery);

    if (_existedRestData && _existedRestData._id + '' != _id + '') {
        _result.ok = false;
        _result.errMsg = '已经存在，url + 方法 不能重复!';
        console.error('已经存在，url + 方法 不能重复!');
        return _result;
    }

    // ------------- 不能重复 end
    restData.requestDemo = processDemo(restData.requestDemo);
    restData.responseDemo = processDemo(restData.responseDemo);

    if (_id) {
        _result._id = _id;
        _result.ok = yield restDao.updateOne({
            _id: restDao._id(_id)
        }, restData);
    } else {
        restData.isRemoved = false;
        let _insertResult = yield restDao.insert(restData);
        try {
            _result.ok = _insertResult.ok;
            _result._id = _insertResult.insertedIds[0];
        } catch (e) {
            console.error(e);
        }
    }
    return _result;
};


service.removeById = function*(id) {
    let _id = restDao._id(id);
    return yield restDao.remove({
        _id: _id
    });
};




// ----------------------------------------------
function processDemo(str) {

    console.log('before#####>>>>', typeof str, str);
    str = str || '';
    if (str) {
        str = str.replace(/[\\\r\\\n]/g, '');
        // str = JSON.stringify(JSON.parse(str));
        try {
            str = JSON.stringify(JSON.parse(str), null, '\t');
        } catch (e) {
            throw ('数据不是JSON: ' + str);
        }
    }

    console.log('end-------->>>>', typeof str, str);

    return str;
}
