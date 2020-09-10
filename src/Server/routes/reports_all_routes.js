module.exports = (req, res) =>{
    console.log('request all reports');

    req.app.locals.collection.findOne({ 'date': req.query.date }, (err, result) => {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({}));
            return;
        }

        if (result === null || result === {} || result === undefined) {
            res.send(JSON.stringify({}));
        }

        res.send(JSON.stringify(result.countries.sort((a, b) => {
            if (a.name > b.name) return 1;
            if (a.name === b.name) return 0;
            if (a.name < b.name) return -1;
        })));
    });
}