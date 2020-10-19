import React, { Suspense } from 'react';
import { Component } from 'react';
import io from 'socket.io-client'
import './Control.css'
import '../_loginLayout/Login.css'
import List from '../_listLayout/List'


export default (props)=>{
    const [zipcode,setZipcode]=React.useState('')
    const [address,setAddress]=React.useState('')
    const [neighborhood,setNeighborhood]=React.useState('')
    const [country,setCountry]=React.useState('')
    const [type,setType]=React.useState('')
    const [begin,setBegin]=React.useState('')
    const [endpoint,setEndpoint]=React.useState('')
    const [lpage,setLpage]=React.useState('')
    const [page,toPage]=React.useState('logo');
    const [auth,toAuth]=React.useState(!!localStorage.getItem('token')?false:true);
    const [email,setEmail]=React.useState('')
    const [token,setToken]=React.useState(localStorage.getItem('token'))
    const bomb={
        page:lpage,
        setPage:setLpage,
        seach:{
            input:[
                {
                    name:'Zipcode',
                    sigla:"ZC",
                    width:70,
                    value:zipcode,
                    setValue:setZipcode,
                },{
                    name:'Address',
                    sigla:"AD",
                    width:150,
                    value:address,
                    setValue:setAddress,
                },{
                    name:'Neighborhood',
                    sigla:"NH",
                    width:120,
                    value:neighborhood,
                    setValue:setNeighborhood,
                },{
                    name:'Country',
                    sigla:"CT",
                    width:60,
                    value:country,
                    setValue:setCountry,
                }
            ],
        },
        create:{
            input:[
                {name:'address'},
                {name:'fire'},
                {name:'rescue'},
                {name:'salvage'}
            ]
        },
        aboult:{}
    };
    const call={
        page:lpage,
        setPage:setLpage,
        seach:{
            input:[
                {
                    name:'Type',
                    sigla:"TP",
                    width:70,
                    option: ['fire','rescue','salvage'],
                    value:type,
                    setValue:setType,
                },{
                    name:'Address',
                    sigla:"AD",
                    width:150,
                    value:address,
                    setValue:setAddress,
                },{
                    name:'Priority',
                    sigla:"PT",
                    width:60,
                    value:country,
                    setValue:setCountry,
                }
            ],
        },
        create:{
            input:[
                {name:'type'},
                {name:'requirements'},
                {name:'timeToEnd'},
                {name:'address'},
                {name:'GroupId',option:[]},
                {name:'Priority',option:[]}
            ]
        },
    };
    const report={
        page:lpage,
        setPage:setLpage,
        seach:{
            input:[
                {
                    name:'Begin',
                    sigla:"ZC",
                    width:70,
                    value:begin,
                    setValue:setBegin,
                },{
                    name:'Endpoint',
                    sigla:"AD",
                    width:150,
                    value:endpoint,
                    setValue:setEndpoint,
                }
            ],
        },
        create:{
            input:[
                {

                }
            ]
        }
    };
    const socket = io('http://localhost:4000')
    const connect=()=>{
        console.log(email)
        socket.emit('verify',email)
    }
    socket.on('token',(data)=>{
        console.log(data);
        localStorage.setItem('token',data.token);
        setToken(data.token)
        toAuth(false);
    })
    /*const get_request=()=>{
        console.log('sending')
        const req=new XMLHttpRequest();
        req.open('GET','http://localhost:4000'+'/run');
        req.onload=(e)=>{
            console.log(req.status);
            console.log(req.responseText);
        }
        req.send()
    }*/
    return(
    <>{!auth&&
        <div className="container">
            <div className="logo">
                <div className="imgEmail"></div>
                <span>teste@teste.com</span>
                <div className="img"></div> 
            </div>
        
            <div className="controlData">
                <div className="lateralMenor">
                    <div className="navTabs">
                       <button onClick={()=>{setLpage("seach");toPage('bomb')}}>Bombeiros</button>
                       <button onClick={()=>{setLpage("seach");toPage('call')}}>Ocorrências</button>
                       <button onClick={()=>{setLpage("seach");toPage('report')}}>Atendimento</button>
                    </div>

                </div>

                <div className="lateralMaior">
                    {page=="logo"&&
                        <div className="lateralMaior"><div className="img2"></div>
                            <span></span>
                        </div>}
                    {page=="bomb"&&List(bomb)}
                    {page=="call"&&List(call)}
                    {page=="report"&&List(report)}
                </div>
            </div>
        </div>
    }{!!auth&&
        <div className="LoginCard">
            <div className="img"></div>
            
            <input type="email" id="email" placeholder="Email" value={email} onChange={(e)=>{console.log(e.target.value);setEmail(e.target.value);}}/>
            <br/>
            <input type="button" value="Entrar" id="senha" onClick={()=>connect()}/>
        </div>
    }</>
    )
}