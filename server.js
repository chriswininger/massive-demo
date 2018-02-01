const massive = require('massive');
const express = require('express');
const bodyParser = require('body-parser');
const APIRouter = require('./routes/apis');
const endPointRouter = require('./routes/endPoints');

const app = express();

const port = 3003;

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

// === make db connection
console.info('connecting to the database');
massive({
    host: '127.0.0.1',
    port: 5432,
    database: 'massive-demo',
    user: 'chris',
    password: 'xxx',
    scripts: './db'
}).then(db => {
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
app.use('/api', [APIRouter(app), endPointRouter(app)]);
app.use('/vendor', express.static('node_modules'));
app.use('/', express.static('public'));
