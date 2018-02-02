const { getBaseController } = require('./utils/controllerUtils');
module.exports = getBaseController({
    schemaName: 'end-points',
    tableName: 'end_points',
    viewName: 'end_points_merged'
});
