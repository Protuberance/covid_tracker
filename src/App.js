import React, { Component } from 'react';
import style from './App.module.css';
import GeneralPieChart from './Modules/GeneralPieChart/GeneralPieChart';
import OneCountryStatistics from './Modules/OneCountryStatistics/OneCountryStatistics';
import TopCountries from './Modules/TopCountries/TopCountries';
import AllCountries from './Modules/AllCountries/AllCountries';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: true,
      countries: null,
      dropdownData: null
    }
  }

  componentDidMount() {
    let url = "/regions";

    fetch(url)
      .then(response => response.json())
      .then(data => {

        let dropdownData = data.map((element) => {
          let result = {
            key: element.iso,
            text: element.name
          }
          return result
        });

        dropdownData.sort();

        this.setState({
          loading: false,
          countries: data,
          dropdownData: dropdownData
        });
      })
  }

  render() {
    if (this.state.loading)
      return ('Hello');
    else {
      return (
        <div className={style.AppContainer}>
          <GeneralPieChart></GeneralPieChart>
          <OneCountryStatistics dropdownData={this.state.dropdownData} countries={this.state.countries}></OneCountryStatistics>
          <TopCountries></TopCountries>
          <AllCountries></AllCountries>
        </div>
      )
    }
  }
}

export default App;
