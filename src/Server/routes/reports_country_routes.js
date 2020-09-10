module.exports = (req, res) => {
    req.app.locals.collection.findOne({ 'date': req.query.date }, (err, result) => {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({}));
            return;
        }

        if (result === null || result === {} || result === undefined) {
            res.send(JSON.stringify({}));
        }

        res.send(JSON.stringify(result.countries.find((item) => item.iso === req.query.iso)));
    });
}