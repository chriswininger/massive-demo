const APISchema = require('../schemas/apis');

module.exports = {
    getAPIs(app, query) {
        const db = app.get('db');
        query = query || {};

        return db.apis_merged.find(query, APISchema);
    },

    createAPI(app, api) {
        const db = app.get('db');
        api = api || {};

        return db.apis.insert(api);
    }
};