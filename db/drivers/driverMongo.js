const MongoClient = require('mongodb').MongoClient;

module.exports = {
    connect() {
        const assert = require('assert');

        // Connection URL
        const url = 'mongodb://localhost:27017';
        
        // Database Name
        const dbName = 'massive-demo';

        return new Promise(function(resolve, reject) {
            // Use connect method to connect to the server
            MongoClient.connect(url, (err, client) => {
                if(err)
                    reject(err);
                else
                    resolve(client.db(dbName));
            });
        });
    }
}
