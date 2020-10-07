import React from 'react'
import { Component } from 'react';

import './Control.css'

export default class Control extends Component {
    render() {
        return(
            <div className="container">
                <div className="logo">
                    <div className="imgEmail"></div>
                    <span>teste@teste.com</span>
                    <div className="img"></div> 
                </div>
            
                <div className="controlData">
                    <div className="lateralMenor">
                        <div className="navTabs">
                            <ul>
                                <li>
                                    <input type="radio" name="tabs" className="rd_tabs" id="tab1"/>
                                    <label htmlFor="tab1">Bombeiros</label>
                                    <div className="content">TELA BOMBEIROS</div>
                                </li>
                                <li>
                                    <input type="radio" name="tabs" className="rd_tabs" id="tab2"/>
                                    <label htmlFor="tab2">Ocorrências</label>
                                    <div className="content">TELA OCORRENCIAS</div>
                                </li>
                                <li>
                                    <input type="radio" name="tabs" className="rd_tabs" id="tab3"/>
                                    <label htmlFor="tab3">Atendimentos</label>
                                    <div className="content">TELA ATENDIMENTOS</div>
                                </li>
                            </ul>
                        </div>

                    </div>

                    <div className="lateralMaior">
                        <div className="img2"></div>
                        <span></span>
                    </div>
                </div>
            </div>
        )
    }
}