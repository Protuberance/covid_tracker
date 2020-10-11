import React, { Component } from 'react';
import style from './App.module.css';
import GeneralPieChart from './Modules/GeneralPieChart/GeneralPieChart';
import OneCountryStatistics from './Modules/OneCountryStatistics/OneCountryStatistics';
import TopCountries from './Modules/TopCountries/TopCountries';
import AllCountries from './Modules/AllCountries/AllCountries';
import { thresholdFreedmanDiaconis } from 'd3';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dataLoading: true,
      datesLoading: true,
      countries: null,
      dropdownData: null,
      firstDate: null,
      lastDate: null
    }
  }

  componentDidMount() {
    this.getRegions();
    this.getDates();
  }

  async getRegions() {
    let url = "/regions";

    let response = await fetch(url);
    let data = await response.json();

    let dropdownData = data.map((element) => {
      let result = {
        key: element.iso,
        text: element.name
      }
      return result
    });

    dropdownData.sort();

    this.setState({
      ...this.state,
      dataLoading: false,
      countries: data,
      dropdownData: dropdownData
    });
  }

  async getDates() {
    let url = '/dates';
    let response = await fetch(url);
    let data = await response.json();

    console.log(data);

    this.setState({
      ...this.state,
      datesLoading: false,
      firstDate: data.firstDate,
      lastDate: data.lastDate
    })
  }

  render() {
    if (this.state.dataLoading || this.state.datesLoading)
      return ('Hello');
    else {
      return (
        <div className={style.AppContainer}>
          <GeneralPieChart firstDate={this.state.firstDate} lastDate={this.state.lastDate}></GeneralPieChart>
          <OneCountryStatistics dropdownData={this.state.dropdownData} countries={this.state.countries} firstDate={this.state.firstDate} lastDate={this.state.lastDate}></OneCountryStatistics>
          <TopCountries firstDate={this.state.firstDate} lastDate={this.state.lastDate}></TopCountries>
          <AllCountries firstDate={this.state.firstDate} lastDate={this.state.lastDate}></AllCountries>
        </div>
      )
    }
  }
}

export default App;