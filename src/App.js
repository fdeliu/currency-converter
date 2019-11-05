import React, { Component } from "react";
import NavBar from './components/NavBar'
import Converter from './components/Converter';
import Footer from './components/Footer';
import './App.css';


class App extends Component {

  render() {
    return (
      <React.Fragment>
        <NavBar />
        <div className="container py-4"> 
          <Converter />
        </div>
        <Footer/>
      </React.Fragment>
     
    )
  };
}

export default App;

