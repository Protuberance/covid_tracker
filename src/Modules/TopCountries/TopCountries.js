import React, { Component } from 'react';
import style from './TopCountries.module.css';
import moment from 'moment';
import SelectDate from '../SelectDate/SelectDate';
import StatisticWithCountriesName from '../StatisticWithCountriesName/StatisticWithCountriesName';
import Title from '../Title/Title';
import ColumnsLongTitle from '../ColumnsTitle/ColumnsLongTitle';

class TopCountries extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDate: props.lastDate,
            firstDate: props.firstDate,
            lastDate: props.lastDate,
            top: null,
            loadError: false,
            query: 'confirmed'
        };

        this.columnsTitleClickHandler = this.columnsTitleClickHandler.bind(this);
        this.dateChangeHandler = this.dateChangeHandler.bind(this);
        this.dateFastForwardHandler = this.dateFastForwardHandler.bind(this);
        this.dateRewindhandler = this.dateRewindhandler.bind(this);
    }

    componentDidMount() {
        this.getTop(this.state.currentDate);
    }

    async getTop(date) {
        let url = `/reports/top?date=${date}&query=${this.state.query}`;

        try {
            let response = await fetch(url);
            let data = await response.json();
            this.setState({
                ...this.state,
                top: data
            });
        } catch (err) {
            this.setState({
                ...this.state,
                loadError: true
            });
        }
    }

    columnsTitleClickHandler(e) {
        let query;

        if (e.target.textContent === 'Всего:') {
            query = 'confirmed';
        }
        else if (e.target.textContent === 'Новых:') {
            query = 'confirmed_diff';
        }
        else if (e.target.textContent === 'Смертей:') {
            query = 'deaths';
        }
        else if (e.target.textContent === 'Окрепшие:') {
            query = 'recovered';
        }

        if (query !== this.state.query) {
            this.setState({ ...this.state, query: query }, () => {
                this.getTop(this.state.currentDate);
            })
        }
    }

    dateChangeHandler(e) {
        this.setState({ currentDate: e.target.value });
        this.getTop(e.target.value);
    }

    dateRewindhandler() {
        this.setState({ ...this.state, currentDate: moment(this.state.currentDate).add(-1, 'days').format('YYYY-MM-DD') }, () => this.getTop(this.state.currentDate));
    }

    dateFastForwardHandler() {
        this.setState({ ...this.state, currentDate: moment(this.state.currentDate).add(1, 'days').format('YYYY-MM-DD') }, () => this.getTop(this.state.currentDate));
    }

    render() {
        if (this.state.loadError) {
            return (
                <div className={style.TopCountries}>
                    <Title text='Топ 5 стран'></Title>
                    <SelectDate rewind={this.dateRewindhandler} forward={this.dateFastForwardHandler} currentDate={this.state.currentDate} minDate={this.state.firstDate} maxDate={this.state.lastDate} onChange={this.dateChangeHandler} ></SelectDate>
                    TopCountries...
                </div>
            )
        }
        else if (this.state.top === null) {
            return (
                <div className={style.TopCountries}>
                    <Title text='Топ 5 стран'></Title>
                    <SelectDate rewind={this.dateRewindhandler} forward={this.dateFastForwardHandler} currentDate={this.state.currentDate} minDate={this.state.firstDate} maxDate={this.state.lastDate} onChange={this.dateChangeHandler} ></SelectDate>
                    <div>TopCountries..</div>
                </div>
            )
        } else {
            return (
                <div className={style.TopCountries}>
                    <Title text='Топ 5 стран'></Title>
                    <SelectDate rewind={this.dateRewindhandler} forward={this.dateFastForwardHandler} currentDate={this.state.currentDate} minDate={this.state.firstDate} maxDate={this.state.lastDate} onChange={this.dateChangeHandler} ></SelectDate>
                    <ColumnsLongTitle onClick={this.columnsTitleClickHandler}></ColumnsLongTitle>
                    {
                        this.state.top.map((country, i) => {
                            return <StatisticWithCountriesName statistic={country} key={i}></StatisticWithCountriesName>
                        })
                    }
                </div>
            )
        }
    }
}

export default TopCountries;