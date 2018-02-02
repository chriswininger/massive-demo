module.exports = {
    getBaseController(options) {
        const { schemaName, tableName, viewName } = options;
        let schema = null;

        if (schemaName)
            schema = require(__dirname + '/../../schemas/' + schemaName);

        return {
            get(app, query) {
                const db = app.get('db');
                query = query || {};

                return db[viewName || tableName].find(query, schema);
            },

            create(app, entry) {
                const db = app.get('db');
                entry = entry || {};

                return db[tableName].insert(entry);
            },

            update(app, id, fields) {
                const db = app.get('db');
                updateBlock.id = id;
                return db[tableName].update(fields);
            },

            updateAttribute(app, id, changes) {
                const db = app.get('db');
                return db[tableName].modify({ id }, changes, 'attributes');
            }

        };
    }
};
