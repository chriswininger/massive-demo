const express = require('express');
const bodyParser = require('body-parser');
const APIRouter = require('./routes/apis');
const ActionRouter = require('./routes/actions');
const endPointRouter = require('./routes/end-points');
const { connect } = require('./db/drivers/driverPostgres');

const app = express();

const port = 3003;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// === make db connection
console.info('connecting to the database');
connect().then(db => {
    console.info('connection established, run seeds');
    app.set('db', db);
    // start listening after db is setup
    db.seedDataBase().then(() => {
        app.listen(port);
        console.info(`listening on ${port}`)
    }).catch(err =>{
        console.warn('could not run see: ' + err);
        process.exit(1);
    });

}).catch(err => {
    console.warn('could not connect to database: ' + err);
    process.exit(1);
});

// === define routes
app.use('/api', [APIRouter(app), endPointRouter(app), ActionRouter(app)]);
app.use('/vendor', express.static('node_modules'));
app.use('/', express.static('public'));
