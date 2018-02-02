const express = require('express');
const { getAPIs, createAPI, updateAPI } = require('../controllers/apis');

module.exports = (app) => {
    const apiRouter = express.Router();

        // -- get all apis (full fetch)
        apiRouter.get('/apis', (req, res) => {
            getAPIs(app, {}).then(apis => {
                console.log(apis);
                res.status(200).json({ status: 'ok', apis });
            }).catch(err => {
                console.warn(err);
                res.status(500).json({ status: 'fail', message: err });
            });
        });

        // -- create api
        apiRouter.post('/apis', (req, res) => {
            createAPI(app, req.body.api).then(api => {
                console.log(api);
                res.status(200).json({ status: 'success', api });
            }).catch(err => {
                console.warn(err);
                res.status(500).json({ status: 'faile', message: err })
            });
        });

        apiRouter.put('/apis/:apiID/addEndPoint', (req, res) => {
            updateAPI(app, req.body.fields).then(api => {
                console.log(api);
                res.status(200).json({ status: 'success', api });
            }).catch(err => {
                console.warn(err);
                res.status(500).json({ status: 'fail', message: err })
            });
        });

        apiRouter.put('/apis/:apiID/end_points/:endPointID/addEndPoint', (req, res) => {
            
        });

        return apiRouter;
}

// -- update api

// -- add end point to api

// -- create end point

// -- update end point

// -- add action to end point

// -- create action

// -- update action
