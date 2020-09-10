module.exports = (req, res) => {
    req.app.locals.collection.findOne({ 'date': req.query.date }, (err, result) => {
        if (err) {
            console.log(err);
            res.send(JSON.stringify(null));
            return;
        }

        if (result === null || result === {} || result === undefined) {
            res.send(JSON.stringify(null));
            return;
        }

        res.send(JSON.stringify(result.total));
    });
}