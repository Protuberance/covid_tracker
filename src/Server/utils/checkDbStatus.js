const moment = require('moment');
const fetch = require('node-fetch');
const regions = require('../regions.js');

module.exports = async (db) => {
    checkDbStatus(db);
    setInterval(checkDbStatus, 28800000, db);
}

async function checkDbStatus(db) {
    let res = await db.collection('daily_statistics').find().sort({ date: 1 }).toArray();
    let lastDate = res[res.length - 1].date;

    console.log('last date in local db: ' + lastDate);

    while (true) {
        lastDate = moment(lastDate).add(1, 'days').format('YYYY-MM-DD');
        let totalData;

        try {
            totalData = await getTotalStatistic(lastDate);
        } catch (err) {
            console.log('Bad response frome remote server. The database cannot be checked');
            return;
        }

        if (totalData.length === 0) {
            console.log('date in local db is last date');
            return;
        } else {
            console.log('date in local db is not last date');
            try {
                await addNewData(lastDate, totalData, db);
            } catch (err) {
                console.log('Bad response frome remote server. The database cannot be checked');
                return;
            }
        }
    }
}

async function addNewData(date, totalData, db) {
    console.log(date + ' is adding');

    let daysStat = {
        date: date,
        countries: [],
        total: {}
    }

    for (let element of regions) {
        let countrysStat = await getCountryStatistic(element.iso, date);
        countrysStat.iso = element.iso;
        countrysStat.name = element.name;
        daysStat.countries.push(countrysStat);
    }

    daysStat.total = totalData;

    db.collection('daily_statistics').insertOne(daysStat, (err, result) => {
        if (err) {
            console.log(err);
        } else {
            console.log(date + ' is added');
        }
    });
}

async function getCountryStatistic(iso, date) {
    let url = `https://covid-api.com/api/reports?date=${date}&iso=${iso}`;

    let response = await fetch(url);
    let data = await response.json();
    let stat = data.data.reduce((sum, item) => {
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

    return stat;
}

async function getTotalStatistic(date) {
    const url = `https://covid-api.com/api/reports/total?date=${date}`;

    let response = await fetch(url);
    let reports = await response.json();
    return reports.data;
}