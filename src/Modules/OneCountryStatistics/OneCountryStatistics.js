import React, { Component } from 'react';
import SelectDate from '../SelectDate/SelectDate';
import DropdownList from './DropdownList.js';
import SingleLineView from '../SingleLineView/SingleLineView';
import style from './OneCountryStatistics.module.css';
import moment from 'moment';
import PieChart from '../PieChart/PieChart';
import Title from '../Title/Title';
import ColumnsTitle from '../ColumnsTitle/ColumnsTitle';

class OneCountryStatistics extends Component {
    constructor(props) {
        super(props);

        this.state = {
            countries: props.countries,
            dropdownData: props.dropdownData.map((item) => item.text).sort(),
            selectedName: 'Выберите страну',
            statistic: null,
            iso: '',
            currentDate: moment().add(-25, 'days').format('YYYY-MM-DD'),
            pieChartData: [{ name: 'active', value: 150 }, { name: 'deaths', value: 120 }, { name: 'recovered', value: 100 }]
        }

        this.dropdownListHandleChange = this.dropdownListHandleChange.bind(this);
        this.dateChangeHandler = this.dateChangeHandler.bind(this);
        this.dateFastForwardHandler = this.dateFastForwardHandler.bind(this);
        this.dateRewindhandler = this.dateRewindhandler.bind(this);
    }

    getPieChartData(data) {
        let pieChartData =
            [{ name: 'Активные', value: data.active },
            { name: 'Смертей', value: data.deaths },
            { name: 'Окрепшие', value: data.recovered }];
        return pieChartData;
    }

    dropdownListHandleChange(e) {
        let _iso = this.state.countries.find((item) => item.name === e.target.value).iso;

        this.setState({
            selectedName: e.target.value,
            iso: _iso
        });

        this.getStatistic(_iso, this.state.currentDate);
    }

    getStatistic(iso, date) {
        let url = `/reports/country?date=${date}&iso=${iso}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {

                if (data === {}) {
                    this.showError();
                    return;
                }

                this.setState({
                    statistic: data,
                    pieChartData: this.getPieChartData(data)
                });
            })
    }

    showError() {
        console.log('There is no data for this date or country');
    }

    dateChangeHandler(e) {
        this.setState({ currentDate: e.target.value });
        if (this.state.iso !== '')
            this.getStatistic(this.state.iso, e.target.value);
    }
    dateRewindhandler() {
        this.setState({ ...this.state, currentDate: moment(this.state.currentDate).add(-1, 'days').format('YYYY-MM-DD') }, () => {
            if (this.state.iso !== '')
                this.getStatistic(this.state.iso, this.state.currentDate);
        });
    }

    dateFastForwardHandler() {
        this.setState({ ...this.state, currentDate: moment(this.state.currentDate).add(1, 'days').format('YYYY-MM-DD') }, () => {
            if (this.state.iso !== '')
                this.getStatistic(this.state.iso, this.state.currentDate);
        });
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.statistic !== nextState.statistic) {
            return true
        }
        return false;
    }
    render() {
        let width,
            height,
            innerRadius,
            outerRadius;

        const clientWidth = document.documentElement.clientWidth;
        if (clientWidth > 600) {
            width = 540;
            height = 320;
            innerRadius = 50;
            outerRadius = 120;
        } else {
            width = clientWidth;
            height = 200;
            innerRadius = 25;
            outerRadius = 70;
        }

        if (this.state.statistic === null) {
            return (
                <div className={style.OneCountryStatistics}>
                    <Title text='По одной стране'></Title>
                    <SelectDate rewind={this.dateRewindhandler} forward={this.dateFastForwardHandler} currentDate={this.state.currentDate} minDate='2020-02-01' maxDate={moment().add(-1, 'days').format('YYYY-MM-DD')} onChange={this.dateChangeHandler} ></SelectDate>
                    <DropdownList dropdownData={this.state.dropdownData} selectedName={this.state.selectedName} onChange={this.dropdownListHandleChange}></DropdownList>
                </div>
            )
        } else {
            return (
                <div className={style.OneCountryStatistics}>
                    <Title text='По одной стране'></Title>
                    <SelectDate rewind={this.dateRewindhandler} forward={this.dateFastForwardHandler} currentDate={this.state.currentDate} minDate='2020-02-01' maxDate={moment().add(-1, 'days').format('YYYY-MM-DD')} onChange={this.dateChangeHandler} ></SelectDate>
                    <DropdownList dropdownData={this.state.dropdownData} selectedName={this.state.selectedName} onChange={this.dropdownListHandleChange}></DropdownList>
                    <div className={style.textDataWrapper}>
                        <ColumnsTitle></ColumnsTitle>
                        <SingleLineView statistic={this.state.statistic} ></SingleLineView>
                    </div>
                    <PieChart
                        data={this.state.pieChartData}
                        width={width}
                        height={height}
                        innerRadius={innerRadius}
                        outerRadius={outerRadius}
                    />
                </div>
            )
        }
    }
}

export default OneCountryStatistics;