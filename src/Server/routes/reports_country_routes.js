module.exports = (req, res) => {
    req.app.locals.collection.findOne({ 'date': req.query.date }, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        if (result === null || result === {} || result === undefined) {
            res.sendStatus(404);
        }

        res.send(JSON.stringify(result.countries.find((item) => item.iso === req.query.iso)));
    });
}