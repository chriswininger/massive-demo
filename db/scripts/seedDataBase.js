const apiController = require('../../controllers/apis');
const endPointController = require('../../controllers/endPoints');
const actionController = require('../../controllers/actions');
const { waterfall } = require('async');

module.exports = function(app) {
    const db = app.get('db');

    return new Promise((resolve, reject) => {
        waterfall([
            _next => {
                db.dropDatabase().then(() => _next()).catch(err => _next(err));
            },
            _next => {
                apiController.create(app, { name: 'super real company assessment api' }).then(api => {
                    _next(null, api);
                }).catch(err => {
                    reject(err);
                });
            },
            (api, _next) => {
                endPointController.create(app, api.id, {
                    name: 'get all assessments',
                    http_verb: 'get',
                    path: 'assessments',
                }).then(endPoint => {
                    _next(null, api, endPoint);
                }).catch(err => {
                    _next(err);
                });
            },
            (api, endPoint, _next) => {
                apiController.update(app, api.id, {
                    $push: {
                        end_points: endPoint.id
                    }
                }).then(() => _next(null, api, endPoint)).catch(err => _next(err));
            },
            (api, endPoint, _next) => {
                actionController.create(app, api.id, {
                    name: 'read data',
                    type: 'db-query',
                    x: 100,
                    y: 20,
                    table: 'assessment',
                    expects: [],
                    queryType: 'SELECT',
                    connection: 'someID',
                    previus_actions: []
                }).then(action => _next(null, api, endPoint, action)).catch(err => _next(err));
            },
            (api, endPoint, readDataAction, _next) => {
                const setObj = { $push: {}};
                console.log(setObj);
                setObj.$push['_children.' + endPoint.id + '.actions'] = readDataAction.id;
                console.log(setObj);
                apiController.update(app, api.id, setObj).then(() => {
                    _next(null, api, endPoint);
                }).catch((err) => {
                    _next(err);
                });
            }
        ], err => {
            if (err) {
                console.error(err);
                reject(err);
            } else {
                resolve();
            }
        });
       
       
        
    });
};
