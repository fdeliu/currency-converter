import React, { Component } from "react";
import Chart from "react-apexcharts";
import moment from 'moment';
import axios from 'axios';
import classnames from 'classnames';
import loadingSpinner from '../img/loading.gif';


let today = moment().format('YYYY-MM-DD');
let defaultDate = moment().subtract(1, 'months').format('YYYY-MM-DD');


class AreaChart extends Component {
  state = {
    startDate: defaultDate,
    endDate: today,
    isLoading: false,
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: []
      }
    },
    series: [
      {
        name: "",
        data: []
      }
    ]
  };

  handleChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }
  getTimeSeriesRates = (props) => {

    const { startDate, endDate } = this.state;
    const { fromSymbol, toSymbol, rate } = this.props;
    if (endDate > startDate && endDate <= today) {
      this.setState({
        isLoading: true
      })
      const url = `https://frankfurter.app/${startDate}..${endDate}?from=${fromSymbol}&to=${toSymbol}`;
      axios.get(url)
        .then(res => {
          const rates = res.data.rates;
          const xValues = Object.keys(rates).map(ele => ele);
          const values = Object.values(rates);
          const yValues = [];
          Object.values(values).map(key => yValues.push(key[toSymbol]));

          this.setState({
            options: {
              xaxis: {
                categories: xValues
              },
              yaxis: {
                min: 0,
                max: rate + 4,
                tickAmount: 10
              }
            },
            series: [
              {
                name: `1 ${fromSymbol} = ${toSymbol}`,
                data: yValues,
              }
            ],
            isLoading: false
          })
        })
        .catch(err => console.log(err))
    }
  }

  render() {
    const { startDate, endDate, isLoading } = this.state;
    return (
      <div className="card border-secondary mb-3">
        <div className="card-header text-center bg-primary text-white"><h4>Get Time Series Data</h4></div>
        <div className="card-body text-center">
          {startDate >= endDate ?
            (<div className="alert alert-danger my-2" role="alert">
              <strong>End date must be greater than start date</strong>
            </div>) : null}
          {endDate > today ?
            (<div className="alert alert-danger my-2" role="alert">
              <strong>End date must be less than or equal today's date</strong>
            </div>) : null}
          <div className="row">
            <div className="col">
              <label>Start Date:</label>
              <input type="date" value={startDate}
                name="startDate"
                max={endDate}
                className={classnames('form-control', {
                  'is-invalid': startDate === endDate ? true : false
                })}
                onChange={this.handleChange} />
            </div>
            <div className="col">
              <label>End Date:</label>
              <input type="date" value={endDate} name="endDate"
                max={endDate}
                className={classnames('form-control', {
                  'is-invalid': startDate === endDate ? true : false
                })}
                onChange={this.handleChange} />
            </div>
          </div>
          <button type="button" onClick={this.getTimeSeriesRates}
            disabled={(startDate === "" || startDate >= endDate || endDate > today) ? true : false}
            className="btn btn-primary my-3">Get Rates</button>
          {
            isLoading ? (
              <div className="text-center my-3">
                <img src={loadingSpinner} alt="loading-spinner" />
              </div>) : (
                <Chart
                  options={this.state.options}
                  series={this.state.series}
                  type="line"
                  width="100%"
                />
              )
          }
        </div>
      </div>


    );
  }
}

export default AreaChart;