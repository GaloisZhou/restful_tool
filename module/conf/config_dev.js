module.exports = {
    mongoDb: {
        db: 'saiman_rest',
        host: '127.0.0.1',
        port: 27017,
        // username: 'saiman',
        // password: 'saimankeji',
        collections: {
            adminUser: 'admin_user',
            restApi: 'rest_api',
            project: 'project',
            project_module: 'project_module',
        }
    },
    redisDb: {
        session: {
            host: '127.0.0.1',
            port: 6379,
            db: 1,
            ttl: 60 * 60 * 24, // second
            // password: 'saimankeji',
            key: 'saiman$#'
        }
    },
    domain: {
        server: 'localhost:3001'
    }
};
