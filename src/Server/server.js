const express = require('express');
const MongoClient = require('mongodb').MongoClient;
const route = require('./routes/index')
const dataUpdate = require('./utils/dataUpdate');

const app = express();

app.use(route);

app.use(express.static("../public"));

MongoClient.connect('mongodb://localhost:27017/', { useUnifiedTopology: true }, (err, database) => {

    if (err) {
        console.log(err);
        return;
    }
    
    app.locals.collection = database.db('covid_tracker').collection('daily_statistics');

    app.listen(8080, () => { console.log('server is ran') });

    dataUpdate(database.db('covid_tracker'));
});
