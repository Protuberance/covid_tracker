module.exports = (req, res) => {
    console.log('request top');

    const date = req.query.date;
    const query = req.query.query;

    req.app.locals.collection.findOne({ date: date }, (err, result) => {
        if (err) {
            console.log(err);
            res.send(JSON.stringify({}));
        }

        if (result === null || result === {} || result === undefined) {
            res.send(JSON.stringify({}));
        }

        const top = result.countries.sort((a, b) => {
            if (a[`${query}`] > b[`${query}`]) return -1;
            if (a[`${query}`] === b[`${query}`]) return 0;
            if (a[`${query}`] < b[`${query}`]) return 1;
        })
            .slice(0, 5);

        res.send(JSON.stringify(top));
    });
}