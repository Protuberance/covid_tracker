import React, { Component } from 'react';
import style from './AllCountries.module.css';
import SelectDate from '../SelectDate/SelectDate';
import moment from 'moment';
import StatisticWithCountriesName from '../StatisticWithCountriesName/StatisticWithCountriesName';
import Title from '../Title/Title';
import ColumnsTitleLong from '../ColumnsTitle/ColumnsTitleLong';

class AllCountries extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDate: moment().add(-2, 'days').format('YYYY-MM-DD'),
            countries: null
        };

        this.dateChangeHandler = this.dateChangeHandler.bind(this);
        this.dateFastForwardHandler = this.dateFastForwardHandler.bind(this);
        this.dateRewindhandler = this.dateRewindhandler.bind(this);
    }

    dateChangeHandler(e) {
        this.setState({ currentDate: e.target.value });
        this.getAllCountries(e.target.value);
    }
    dateRewindhandler() {
        this.setState({ ...this.state, currentDate: moment(this.state.currentDate).add(-1, 'days').format('YYYY-MM-DD') }, () => this.getAllCountries(this.state.currentDate));
    }
    dateFastForwardHandler() {
        this.setState({ ...this.state, currentDate: moment(this.state.currentDate).add(1, 'days').format('YYYY-MM-DD') }, () => this.getAllCountries(this.state.currentDate));
    }

    getAllCountries(date) {
        let url = `/reports/all?date=${date}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                
                if (data === {}) {
                    this.showError();
                    return;
                }

                this.setState({
                    ...this.state,
                    countries: data
                });
            })
    }

    showError() {
        console.log('There is no data for this date or country');
    }

    componentDidMount() {
        this.getAllCountries(this.state.currentDate);
    }

    render() {
        if (this.state.countries === null) {
            return (
                <div className={style.AllCountries}>
                    AllCountries...
                </div>
            )
        }
        return (
            <div className={style.AllCountries}>
                <Title text='Все страны'></Title>
                <SelectDate rewind={this.dateRewindhandler} forward={this.dateFastForwardHandler} currentDate={this.state.currentDate} minDate='2020-02-01' maxDate={moment().add(-1, 'days').format('YYYY-MM-DD')} onChange={this.dateChangeHandler} ></SelectDate>
                <ColumnsTitleLong></ColumnsTitleLong>
                {
                    this.state.countries.map((country, i) => {
                        return <StatisticWithCountriesName statistic={country} key={i}></StatisticWithCountriesName>
                    })
                }
            </div>
        )
    }
}

export default AllCountries;