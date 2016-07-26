use saiman_rest
db.auth('saiman', 'saimankeji');





use admin
db.createUser({
    user: "root_root",
    pwd: "root_root_root",
    roles: [
        { role: "root", db: "admin" }
    ]
})

use saiman_rest
db.createUser({
    user: "saiman",
    pwd: "saimankeji",
    roles: [
        { role: "readWrite", db: "saiman_rest" }
    ]
})



// TODO
项目不用 angularjs
列表,新增按钮
详情,模块列表,新增模块按钮

接口 添加 项目._id 模块._id
接口唯一性判断  url + project._id
接口列表页自动添加 ?project_id=project._id


