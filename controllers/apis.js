const { getBaseController } = require('./utils/controllerUtils');
module.exports = getBaseController({
    schemaName: 'apis',
    tableName: 'apis',
    viewName: 'apis_merged'
});
