const uuid = require('uuid4');

module.exports = {
    get(app, query) {
        const db = app.get('db');
        query = query || {};

        return db.end_points_merged.find(query, endPointsSchema);
    },

    create(app, apiID, endPoint) {
        const db = app.get('db');
        const apis = db.collection('apis');
        const id = uuid();

        endPoint = endPoint || {};
        endPoint.id = id;
        endPoint.created = new Date(Date.now());

        // insert this guy into our model list
        const setObj = { $set: {} };
        setObj.$set['_children.' + id] = endPoint;

        return new Promise((resolve, reject) => {
            apis.updateOne({ id: apiID }, setObj).then(() => resolve(endPoint)).catch(err => reject(err));
        });
    }
};