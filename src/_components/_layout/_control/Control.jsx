import React, { Suspense } from 'react';
import { Component } from 'react';
import io from 'socket.io-client'
import './Control.css'
import '../_loginLayout/Login.css'
const Bomb=(props)=>{
    return (<button onClick={()=>{props.toAuth(true)}}> algo</button>)
}
export default (props)=>{
    const [page,toPage]=React.useState('logo');
    const [auth,toAuth]=React.useState(!!localStorage.getItem('token')?false:true);
    const [email,setEmail]=React.useState('')
    const [token,setToken]=React.useState(localStorage.getItem('token'))
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
                       <button onClick={()=>{toPage('bomb')}}>Bombeiros</button>
                       <button onClick={()=>toPage('call')}>Ocorrências</button>
                       <button onClick={()=>toPage('report')}>Atendimento</button>
                    </div>

                </div>

                <div className="lateralMaior">
                    {page=="logo"&&
                        <div className="lateralMaior"><div className="img2"></div>
                            <span></span>
                        </div>}
                    {page=="bomb"&&<Bomb toAuth={toAuth} setToken={setToken}/>}
                    {/*page=="call"&&<Call/>*/}
                    {/*page=="report"&&<Report/>*/}
                </div>
            </div>
        </div>
    }{!!auth&&
        <div className="LoginCard">
            <div className="logo">
                <div className="img"></div>
            </div>
            <input type="email" id="email" placeholder="Email" value={email} onChange={(e)=>{console.log(e.target.value);setEmail(e.target.value);}}/>
            <br/>
            <input type="button" value="Entrar" id="senha" onClick={()=>connect()}/>
        </div>
    }</>
    )
}