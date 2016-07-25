module.exports = {
    mongoDb: {
        db: 'saiman_rest',
        host: '192.168.26.199',
        port: 27017,
        username: 'saiman',
        password: 'saimankeji',
        collections: {
            adminUser: 'admin_user',
            restApi: 'rest_api',
        }
    },
    redisDb: {
        session: {
            host: '192.168.26.199',
            port: 6379,
            db: 1,
            ttl: 60 * 60 * 24, // second
            // password: 'saimankeji',
            key: 'saiman$#'
        }
    },
};
