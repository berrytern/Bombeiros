import React, { Component } from 'react'
//import { Link } from 'react-router-dom'

import './Login.css'

export default class Login extends Component{
    render() {
        return(
            <div className="LoginCard">
                <div className="logo">
                    <div className="img"></div>
                </div>
                <input type="email" name="" id="email" placeholder="Email"/>
                <br/>
                <input type="button" value="Entrar" id="senha"/>
            </div>
        )
    }
}