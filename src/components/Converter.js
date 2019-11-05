import React, { Component } from 'react';
import axios from 'axios';
import moment from 'moment';
import classnames from 'classnames';

import { currencies } from "../data/currencies";

import AreaChart from './AreaChart';

let today = moment().format('YYYY-MM-DD');

class Converter extends Component {
    state = {
        fromAmount: 1,
        toAmount: "",
        fromSymbol: "EUR",
        toSymbol: "USD",
        date: today,
        historyRate: "",
        rate: ""
    }
    componentDidMount() {
        this.getLiveRates();
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        }, this.convertData)
    }

    handleSelect = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        }, this.getLiveRates);
    }
    getLiveRates = () => {
        const { fromSymbol, toSymbol } = this.state;
        if (fromSymbol !== toSymbol) {
            axios.get(`https://frankfurter.app/latest?from=${fromSymbol}&to=${toSymbol}`)
                .then(res => {
                    this.setState({
                        rate: res.data.rates[toSymbol],
                        isConverting: false
                    }, this.convertData)
                })
                .catch(err => console.log(err))
        }

    }
    convertData = () => {
        const { fromAmount, fromSymbol, toSymbol } = this.state;
        if (fromAmount !== "") {
            axios.get(`https://frankfurter.app/latest?amount=${fromAmount}&from=${fromSymbol}&to=${toSymbol}`)
                .then(res => {
                    this.setState({
                        toAmount: res.data.rates[toSymbol]
                    })
                })
                .catch(err => console.log(err))
        }
    }

    getDateRates = () => {
        const { date, fromSymbol, toSymbol } = this.state;
        if (date !== "") {
            axios.get(`https://frankfurter.app/${date}?from=${fromSymbol}&to=${toSymbol}`)
                .then(res => {
                    this.setState({
                        historyRate: res.data.rates[toSymbol]
                    })
                })
        }
    }
    changeSymbols = () => {
        const { fromSymbol, toSymbol } = this.state;
        this.setState({
            fromSymbol: toSymbol,
            toSymbol: fromSymbol
        }, this.getLiveRates)
    }
    render() {

        const { fromSymbol, toSymbol, date, rate } = this.state;
        return (
            <div className="row" style={{ padding: "70px 0px" }}>
                <div className="col-md-12 col-lg-4">
                    <div className="card border-secondary mb-3">
                        <div className="card-header bg-primary text-white">
                            <h4>Converter</h4>
                        </div>
                        <div className="card-body">
                            {fromSymbol === toSymbol ? (<div className="alert alert-danger my-2 text-center" role="alert">
                                <strong>Currencies must be different</strong>
                            </div>) : null}
                            <h4 className="card-title text-center">
                                1 {fromSymbol} = {this.state.rate} {toSymbol}
                            </h4>
                            <form>
                                <div className="row my-3 text-center">
                                    <div className="col">
                                        <div className="form-group">
                                            <select className={classnames('form-control', {
                                                'is-invalid': fromSymbol === toSymbol ? true : false
                                            })}
                                                value={this.state.fromSymbol}
                                                id="fromSymbol"
                                                name="fromSymbol"
                                                onChange={this.handleSelect}>
                                                {Object.keys(currencies).map(key =>
                                                    <option value={key} key={key}>{currencies[key]}</option>
                                                )}
                                            </select>
                                            <div className="my-3">
                                                <input type="number" className="form-control"
                                                    min="0" name="fromAmount"
                                                    width="auto"
                                                    value={this.state.fromAmount}
                                                    onChange={this.handleChange}
                                                />
                                            </div>
                                        </div>
                                    </div>
                                    <p className="text-center">
                                        <i className="fa fa-refresh fa-2x" style={{ color: '#2C3E50' }}
                                            onClick={this.changeSymbols} />
                                    </p>
                                    <div className="col">
                                        <div className="form-group">
                                            <select className={classnames('form-control', {
                                                'is-invalid': fromSymbol === toSymbol ? true : false
                                            })}
                                                value={this.state.toSymbol}
                                                id="toSymbol"
                                                name="toSymbol"
                                                onChange={this.handleSelect}>
                                                {Object.keys(currencies).map(key =>
                                                    <option value={key} key={key}>{currencies[key]}</option>
                                                )}
                                            </select>
                                            <div className="my-3">
                                                <input type="number" className="form-control" readOnly name="toAmount" value={this.state.toAmount} onChange={this.handleChange} placeholder="0" />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </form>
                        </div>
                        <div className="card-header bg-primary text-white"><h4>Get rates for a specific day</h4></div>
                        <div className="card-body">
                            <label>Enter Date:</label>
                            <input type="date" value={date} className="form-control" max={today}
                                onChange={e => this.setState({ date: e.target.value })} />
                            <button type="button" onClick={this.getDateRates} disabled={(date === "" || date > today) ? true : false} className="btn btn-primary my-3">Get Rate</button>
                            <h4>1 {fromSymbol} = {this.state.historyRate} {toSymbol}</h4>
                        </div>
                    </div>
                </div>
                <div className="col-md-12 col-lg-8">
                    <AreaChart fromSymbol={fromSymbol} toSymbol={toSymbol} rate={rate} />
                </div>
            </div>
        )
    }
}

export default Converter;