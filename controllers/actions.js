const uuid = require('uuid4');
const collName = 'apis';

module.exports = {
    create(app, apiID, action) {
        const db = app.get('db');
        const apis = db.collection(collName);
        action = action || {};

        const id = uuid();

        // with mongo we will need to add some of our own logic for defaults and stuff in our service level
        action.id = id;
        action.created = new Date(Date.now());

        const setObj = { $set: {} };
        setObj.$set['_children.' + id] = action;

        return new Promise((resolve, reject) => {
            console.log(setObj);
            apis.updateOne({ id: apiID}, setObj, {})
                .then(response => resolve(action))
                .catch(err => reject(err));
        });
    }
};