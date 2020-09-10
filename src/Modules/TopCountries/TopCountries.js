import React, { Component } from 'react';
import style from './TopCountries.module.css';
import SelectDate from '../SelectDate/SelectDate';
import moment from 'moment';
import StatisticWithCountriesName from '../StatisticWithCountriesName/StatisticWithCountriesName';
import Title from '../Title/Title';
import ColumnsTitleLong from '../ColumnsTitle/ColumnsTitleLong';

class TopCountries extends Component {
    constructor(props) {
        super(props);

        this.state = {
            currentDate: moment().add(-2, 'days').format('YYYY-MM-DD'),
            top: null,
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

    getTop(date) {
        let url = `/reports/top?date=${date}&query=${this.state.query}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {

                if (data === {}) {
                    this.showError();
                    return;
                }

                this.setState({
                    ...this.state,
                    top: data
                });
            })
    }

    showError() {
        console.log('There is no data for this date or country');
    }

    columnsTitleClickHandler(e) {
        let query;

        if (e.target.textContent === 'Всего:') {
            query = 'confirmed'
        }
        else if (e.target.textContent === 'Новых:') {
            query = 'confirmed_diff'
        }
        else if (e.target.textContent === 'Смертей:') {
            query = 'deaths'
        }
        else if (e.target.textContent === 'Окрепшие:') {
            query = 'recovered'
        }

        if (query !== this.state.query) {
            this.setState({ ...this.state, query: query }, () => {
                this.getTop(this.state.currentDate)
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
        if (this.state.top === null) {
            return (
                <div className={style.TopCountries}>
                    <Title text='Топ 5 стран'></Title>
                    <SelectDate rewind={this.dateRewindhandler} forward={this.dateFastForwardHandler} currentDate={this.state.currentDate} minDate='2020-02-01' maxDate={moment().add(-1, 'days').format('YYYY-MM-DD')} onChange={this.dateChangeHandler} ></SelectDate>
                    <div>TopCountries</div>
                </div>
            )
        } else {
            return (
                <div className={style.TopCountries}>
                    <Title text='Топ 5 стран'></Title>
                    <SelectDate rewind={this.dateRewindhandler} forward={this.dateFastForwardHandler} currentDate={this.state.currentDate} minDate='2020-02-01' maxDate={moment().add(-1, 'days').format('YYYY-MM-DD')} onChange={this.dateChangeHandler} ></SelectDate>
                    <ColumnsTitleLong onClick={this.columnsTitleClickHandler}></ColumnsTitleLong>
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