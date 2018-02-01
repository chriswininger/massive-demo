const express = require('express');
const { getAPIs, createAPI, updateAPI } = require('../controllers/endPoints');

module.exports = (app) => {
    const apiRouter = express.Router();

        // -- get all apis (full fetch)
        apiRouter.get('/end-points', (req, res) => {
            getAPIs(app, {}).then(apis => {
                console.log(apis);
                res.status(200).json({ status: 'ok', apis });
            }).catch(err => {
                console.warn(err);
                res.status(500).json({ status: 'fail', message: err });
            });
        });

        // -- create api
        apiRouter.post('/end-points', (req, res) => {
            createAPI(app, req.body.api).then(api => {
                console.log(api);
                res.status(200).json({ status: 'success', api });
            }).catch(err => {
                console.warn(err);
                res.status(500).json({ status: 'fail', message: err })
            });
        });

        return apiRouter;
}
