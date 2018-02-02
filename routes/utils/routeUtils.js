const express = require('express');

module.exports = {
    /*
        app => express app
        urlNS namespace for url, example "actions"
        fieldNS namespace for field on returns, example "action"
    */
    getBaseRouter(app, urlNS, fieldNS) {
        const { get, create, update, updateAttribute } = require(__dirname + '/../../controllers/' + urlNS);
        const router = express.Router();
        const baseURL = '/' + urlNS;

        const getResponeObject = (status, body) => {
            const resp = { status };
            resp[fieldNS] = body;
            return resp;
        }

        // -- get all apis (full fetch)
        router.get(baseURL, (req, res) => {
            get(app, {}).then(entry => {
                console.log(entry);
                res.status(200).json(getResponeObject('ok', entry));
            }).catch(err => {
                console.warn(err);
                res.status(500).json({ status: 'fail', message: err });
            });
        });

        // -- create api
        router.post(baseURL, (req, res) => {
            create(app, req.body.api).then(entry => {
                console.log(entry);
                res.status(200).json(getResponeObject('success', entry));
            }).catch(err => {
                console.warn(err);
                res.status(500).json({ status: 'fail', message: err })
            });
        });

        // -- update api
        router.put(baseURL + '/:id', (req, res) => {
            const id = req.params.id;
            if (!req.body.fields)
                return res.status(500).json({ status: 'fail', message: 'fields is a required attribute on update' });

            update(app, id, req.body.fields, req.body.attributes).then(entry => {
                console.log(entry);
                res.status(200).json(getResponeObject('success', entry));
            }).catch(err => {
                console.warn(err);
                res.status(500).json({ status: 'fail', message: err });
            });
        });

        router.put(baseURL + '/:id/attributes', (req, res) => {
            const id = req.params.id;
            const attributes = req.body.attributes;

            if (!attributes)
                return res.status(500).json({ status: 'fail', message: 'attributes is a required field for attribute update '});

            updateAttribute(app, id, attributes).then(entry => {
                console.log(entry);
                res.status(200).json(getResponeObject('success', entry));
            }).catch(err => {
                console.warn(err);
                res.status(500).json({ status: 'fail', message: err });
            });
        });

        return router;
    }
};
