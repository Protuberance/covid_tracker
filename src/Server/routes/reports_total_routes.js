module.exports = (req, res) => {
    req.app.locals.collection.findOne({ 'date': req.query.date }, (err, result) => {
        if (err) {
            console.log(err);
            res.sendStatus(500);
            return;
        }

        if (result === null || result === {} || result === undefined) {
            res.sendStatus(404);
            return;
        }

        res.send(JSON.stringify(result.total));
    });
}