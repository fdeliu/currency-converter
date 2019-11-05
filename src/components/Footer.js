import React from 'react'

export default function Footer() {
    let year = new Date().getFullYear();
    return (
        <div className="bg-primary text-white" style={{paddingBottom:"10px"}}>
           <div className="container d-flex">
                <p className="pt-4">Disclamer: This application uses <a href="https://www.frankfurter.app" target="_blank" rel="noopener noreferrer"><strong>Frankfurter API</strong></a></p>
                <p className="pt-4 ml-auto">{year} &copy; Flamur Deliu</p>
           </div>
        </div>
    )
}
