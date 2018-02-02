const massive = require('massive');

module.exports = {
    connect() {
        return massive({
            host: '127.0.0.1',
            port: 5432,
            database: 'massive-demo',
            user: 'chris',
            password: 'xxx'
        }, { scripts: './db/scripts/' });
    }
}
