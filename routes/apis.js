const { getBaseRouter } = require('./utils/routeUtils');
module.exports = function(app) {
    return getBaseRouter(app, 'apis', 'api');
};
