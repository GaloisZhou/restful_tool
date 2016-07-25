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




