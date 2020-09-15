const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const route = require('./routes/index')
const dataUpdate = require('./utils/dataUpdate');
const config = require('./config');

const app = express();

app.use(route);

app.use(express.static("../public"));

MongoClient.connect(config.db_uri, { useUnifiedTopology: true }, (err, database) => {

    if (err) {
        console.log(err);
        return;
    }

    app.locals.collection = database.db('covid_tracker').collection('daily_statistics');
    app.listen(config.port, () => { console.log(`server is ran on ${config.port} port`) });

    dataUpdate(database.db('covid_tracker'));
});
