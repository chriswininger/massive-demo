const { getBaseRouter } = require('./utils/routeUtils');
module.exports = function(app) {
    return getBaseRouter(app, 'end-points', 'end-point');
};
