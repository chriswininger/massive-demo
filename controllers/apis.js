const APISchema = require('../schemas/apis');
const uuid = require('uuid4');

module.exports = {
    get(app, query) {
        const db = app.get('db');
        query = query || {};

        const apis = db.collection('apis');
        return apis.get(query);
    },

    create(app, api) {
        const db = app.get('db');
        const apis = db.collection('apis');
        api = api || {};

        const id = uuid();

        // with mongo we will need to add some of our own logic for defaults and stuff in our service level
        api.id = id;
        api.created = new Date(Date.now());

        return new Promise((resolve, reject) => {
            apis.insert(api).then(results => {
                resolve(results.ops[0]);
            }).catch(err => {
                reject(err);
            });
        });
    },

    update(app, id, updateBlock) {
        console.log('!!! FUCK YOU MAN: '+ updateBlock)
        const db = app.get('db');
        const apis = db.collection('apis');
        console.log(updateBlock);
        return apis.updateOne({ id }, updateBlock);
    }
};