module.exports = async (req, res) => {
    let statistics = await req.app.locals.collection.find().sort({ date: 1 }).toArray();
    let firstDate = statistics[0].date;
    let lastDate = statistics[statistics.length - 1].date;

    let result = {
        firstDate,
        lastDate
    }

    res.send(JSON.stringify(result));
}