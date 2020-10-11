import React, { Component } from 'react';
import SingleLineView from '../SingleLineView/SingleLineView';
import SelectDate from '../SelectDate/SelectDate';
import style from './GeneralPieChart.module.css';
import moment from 'moment';
import PieChart from '../PieChart/PieChart';
import Title from '../Title/Title';
import ColumnsTitle from '../ColumnsTitle/ColumnsTitle';

class GeneralPieChart extends Component {
    constructor(props) {
        super(props)

        this.state = {
            statistic: null,
            currentDate: props.lastDate,
            firstDate: props.firstDate,
            lastDate: props.lastDate,
            pieChartData: [{ name: 'active', value: 150 }, { name: 'deaths', value: 120 }, { name: 'recovered', value: 100 }]
        };
        this.dateChangeHandler = this.dateChangeHandler.bind(this);
        this.dateFastForwardHandler = this.dateFastForwardHandler.bind(this);
        this.dateRewindhandler = this.dateRewindhandler.bind(this);
    }

    componentDidMount() {
        this.getStatistic();
    }

    getStatistic() {
        let url = "/reports/total?date=" + this.state.currentDate;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data === null) {
                    this.showError();
                    return;
                }

                this.setState({
                    statistic: data,
                    pieChartData: this.getPieChartData(data)
                });
            });
    }

    showError() {
        console.log('There is no data for this date or country');
    }

    getPieChartData(data) {
        let pieChartData =
            [{ name: 'Активные', value: data.active },
            { name: 'Смертей', value: data.deaths },
            { name: 'Окрепшие', value: data.recovered }];
        return pieChartData;
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (this.state.statistic !== nextState.statistic) {
            return true
        }
        return false;
    }

    dateChangeHandler(e) {
        this.setState({ ...this.state, currentDate: e.target.value }, () => this.getStatistic());
    }

    dateRewindhandler() {
        this.setState({ ...this.state, currentDate: moment(this.state.currentDate).add(-1, 'days').format('YYYY-MM-DD') }, () => this.getStatistic());
    }

    dateFastForwardHandler() {
        this.setState({ ...this.state, currentDate: moment(this.state.currentDate).add(1, 'days').format('YYYY-MM-DD') }, () => this.getStatistic());
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

        if (this.state.statistic === null || this.state.statistic === undefined) return (<div className={style.GeneralPieChart}>GeneralPieChart</div>)
        else {
            return (
                <div className={style.GeneralPieChart}>
                    <Title text='Общая статистика'></Title>
                    <SelectDate rewind={this.dateRewindhandler} forward={this.dateFastForwardHandler} currentDate={this.state.currentDate} minDate={this.state.firstDate} maxDate={this.state.lastDate} onChange={this.dateChangeHandler} ></SelectDate>
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

export default GeneralPieChart;