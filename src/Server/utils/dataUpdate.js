const moment = require('moment');
const fetch = require('node-fetch');
const regions = require('../regions.js');

async function start(db) {
    dataUpdate(db);
    setInterval(dataUpdate, 28800000, db);
}

async function dataUpdate(db) {
    let res = await db.collection('daily_statistics').find().sort({ date: 1 }).toArray();
    let lastDate = res[res.length - 1].date;

    console.log('last date in db: ' + lastDate);


    let condition = true;
    while (condition) {
        lastDate = moment(lastDate).add(1, 'days').format('YYYY-MM-DD');

        console.log('next date in db: ' + lastDate);

        totalData = await getTotalStatistic(lastDate);

        if (totalData.length === 0) {
            console.log('date is last date');

            condition = true;
            return;
        } else {
            console.log('date is not last date');

            await addNewData(lastDate, totalData, db);
        }
    }
}

async function addNewData(date, totalData, db) {

    console.log(date);

    let daysStat = {
        date: date,
        countries: [],
        total: {}
    }
        
    for (let element of regions) {

        let countrysStat = await getStatistic(element.iso, date);
        countrysStat.iso = element.iso;
        countrysStat.name = element.name;

        daysStat.countries.push(countrysStat);
    }

    daysStat.total = totalData;

    db.collection('daily_statistics').insertOne(daysStat, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(date + 'ok');
        }
    });
}

async function getStatistic(iso, date) {

    let url = `https://covid-api.com/api/reports?date=${date}&iso=${iso}`;

    let response = await fetch(url);
    let data = await response.json();
    let stat = getGeneralStat(data.data);

    return stat;
}

async function getTotalStatistic(date) {

    const url = `https://covid-api.com/api/reports/total?date=${date}`;

    let response = await fetch(url);
    let reports = await response.json();
    return reports.data;
}

function getGeneralStat(data) {
    let summStat = data.reduce((sum, item) => {
        let _sum = {
            active: sum.active + item.active,
            active_diff: sum.active_diff + item.active_diff,
            confirmed: sum.confirmed + item.confirmed,
            confirmed_diff: sum.confirmed_diff + item.confirmed_diff,
            deaths: sum.deaths + item.deaths,
            deaths_diff: sum.deaths_diff + item.deaths_diff,
            recovered: sum.recovered + item.recovered,
            recovered_diff: sum.recovered_diff + item.recovered_diff
        }
        return _sum;
    }, {
        active: 0,
        active_diff: 0,
        confirmed: 0,
        confirmed_diff: 0,
        deaths: 0,
        deaths_diff: 0,
        recovered: 0,
        recovered_diff: 0
    });

    return summStat;
}

module.exports = start;