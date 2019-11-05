import React from 'react'
import logo from '../img/logo.JPG'
export default function NavBar() {
    return (
        <nav className="navbar navbar-expand-lg navbar-dark bg-primary fixed-top">
          <div className="container">
                <div className="navbar-brand">
                <h4>My Currency   
                 <img src={logo} className="ml-2" 
                alt="converter-logo" height="32" width="32"/></h4>
             </div>
          </div>
        </nav>
    )
}
