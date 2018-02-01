const endPointsSchema = require('../schemas/endPoints');

module.exports = {
    getAPIs(app, query) {
        const db = app.get('db');
        query = query || {};

        return db.end_points_merged.find(query, endPointsSchema);
    },

    createAPI(app, endPoint) {
        const db = app.get('db');
        endPoint = endPoints || {};

        return db.end_points.insert(endPoint);
    }
};