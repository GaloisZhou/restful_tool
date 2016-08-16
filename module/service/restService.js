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
        _id: '',
        errMsg: '',
    };
    let _id = restData._id || '';
    delete restData._id;

    if (restData.urlPath) { // 去掉 url demo 中的?
        restData.urlPath = restData.urlPath.split('?')[0];
    }
    // ------------- 不能重复
    let _restQuery = {
        projectId: restData.projectId,
        urlPath: restData.urlPath,
        method: restData.method,
        isRemoved: false
    };

    let _existedRestData = yield service.findOne(_restQuery);

    if (_existedRestData && _existedRestData._id + '' != _id + '') {
        _result.ok = false;
        _result.errMsg = '已经存在，项目 + url demo + 方法 不能重复!';
        console.error('已经存在，项目 + url demo + 方法 不能重复!');
        return _result;
    }

    // ------------- 不能重复 end
    try {
        restData.requestDemo = processDemo(restData.requestDemo);
        restData.responseDemo = processDemo(restData.responseDemo);
    } catch (e) {
        _result.errMsg = e;
        return _result;
    }


    // // 处理 requestParams
    // let _requestParams = {};
    // if (restData.requestParams && restData.requestParams.key) {
    //     if (restData.requestParams.key instanceof Array) {
    //         restData.requestParams.key.forEach((rp, ri) => {
    //             _requestParams[rp] = {
    //                 required: isTrue(restData.requestParams.required[ri]) ? 1 : 0,
    //                 type: restData.requestParams.type[ri] || '',
    //                 remark: restData.requestParams.remark[ri] || '',
    //             };
    //         });
    //     } else {
    //         _requestParams[restData.requestParams.key] = {
    //             required: isTrue(restData.requestParams.required) ? 1 : 0,
    //             type: restData.requestParams.type || '',
    //             remark: restData.requestParams.remark || '',
    //         };
    //     }
    // }
    // restData.requestParams = _requestParams;
    //
    // // 处理 responseData
    // let _responseData = {};
    // if (restData.responseData && restData.responseData.key) {
    //     if (restData.responseData.key instanceof Array) {
    //         restData.responseData.key.forEach((rp, ri) => {
    //             _responseData[rp] = {
    //                 required: isTrue(restData.responseData.required[ri]) ? 1 : 0,
    //                 type: restData.responseData.type[ri] || '',
    //                 remark: restData.responseData.remark[ri] || '',
    //             };
    //         });
    //     } else {
    //         _responseData[restData.responseData.key] = {
    //             required: isTrue(restData.responseData.required) ? 1 : 0,
    //             type: restData.responseData.type || '',
    //             remark: restData.responseData.remark || '',
    //         };
    //     }
    // }
    // restData.responseData = _responseData;

    // restData.requestParams = '';
    // restData.responseData = '';

    restData.moduleId = restData.moduleId || '';

    console.log('###########save or update restData: ', restData);

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

function isTrue(value) {
    if (value != 0 && value) {
        return true;
    } else {
        return false;
    }
}