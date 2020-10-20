import React from 'react';
import io from 'socket.io-client'
import './Control.css'
import '../_loginLayout/Login.css'
import List from '../_listLayout/List'


export default (props)=>{
    const url= "http://localhost:4000";
    const [change, setChange]=React.useState(true)
    const [zipcode,setZipcode]=React.useState('')
    const [address,setAddress]=React.useState('')
    const [neighborhood,setNeighborhood]=React.useState('')
    const [country,setCountry]=React.useState('')
    const [c_address,setC_address]=React.useState('')
    const [fire,setFire]=React.useState(null)
    const [rescue,setRescue]=React.useState(null)
    const [salvage,setSalvage]=React.useState(null)
    const [type,setType]=React.useState('')
    const [c_type,setC_type]=React.useState('')
    const [requirements,setRequirements]=React.useState('')
    const [timeToEnd,setTimeToEnd]=React.useState('')
    const [priority,setPriority]=React.useState('')
    const [begin,setBegin]=React.useState('')
    const [endpoint,setEndpoint]=React.useState('')
    const [lpage,setLpage]=React.useState('')
    const [page,toPage]=React.useState('logo');
    const [auth,toAuth]=React.useState(!!localStorage.getItem('token')?false:true);
    const [email,setEmail]=React.useState('')
    const [token,setToken]=React.useState(localStorage.getItem('token'))
    React.useEffect(()=>{
        if(change==true){
            console.log(page,lpage)
            if(page=="call"){
                if(lpage=="create"){
                    setPriority('')
                    setChange(false)
                }
            }
        } 
        return ()=>{
              
        }
    })
    const validate=(responseText)=>{
        const json=JSON.parse(responseText);
        if(!!json['token']){
            setToken=json['token'];
            return true;
        }else{
            return false;
        }
    }
    const bomb={
        change:setChange,
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
                {name:'Address',
                value:c_address,
                setValue:setC_address},
                {name:'Fire',
                value:fire,
                setValue:setFire,},
                {name:'Rescue',
                value:rescue,
                setValue:setRescue},
                {name:'Salvage',
                value:salvage,
                setValue:setSalvage}
            ],
            do:()=>{
                console.log(c_address,fire,rescue,salvage)
                if(!!c_address&&!!fire&&!!rescue&&!!salvage){
                    if(c_address.length<10){
                        alert("address must have more than 10 characters!!!");
                    }else if(isNaN(fire)||!fire){
                            alert("Fire must be a Number");
                    }else if(isNaN(rescue)||!rescue){
                        alert("Rescue must be a Number");
                    }else if(isNaN(salvage)||!salvage){
                        alert("Salvage must be a Number");
                    }else{
                        try{
                            
                            const req=new XMLHttpRequest();
                            req.open('POST',url+"/bombeiro/create");
                            req.setRequestHeader('Content-Type','application/json');
                            req.setRequestHeader('Authorization','Beare '+token)
                            const json=`{"location":"${c_address}","fire":${fire},"rescue":${rescue},"salvage":${salvage}}`
                            console.log(json)
                            req.send(json)
                            req.onload=()=>{
                                if(validate(req.responseText)){
                                    console.log(req.status)
                                    if(req.status==201){
                                        setLpage("seach");
                                    }else{
                                        alert("status: "+req.status);
                                    }
                                }else{
                                    toAuth(true);
                                }
                            }
                        }catch(e){
                            alert("failed request!!!");
                        }
                    }
                }else{
                    alert("there are fields empty");
                }
            }
        },
        aboult:{
            create:[
            ]
            
        }
    };
    const call={
        change:setChange,
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
                {name:'type',
                value:c_type,
                setValue:setC_type},
                {name:'requirements',
                value:requirements,
                setValue:setRequirements},
                {name:'timeToEnd',
                value:timeToEnd,
                setValue:setTimeToEnd},
                {name:'address',
                value:c_address,
                setValue:setC_address},
                {name:'Priority',
                option:['1','2','3','4'],
                value:priority,
                setValue:setPriority}
            ]
        },
    };
    const report={
        change:setChange,
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
    
    const connect=()=>{
        const socket = io(url)
        console.log(email)
        socket.emit('verify',email)
        socket.on('token',(data)=>{
        console.log(data);
        localStorage.setItem('token',data.token);
        setToken(data.token)
        toAuth(false);
    })
    }
    
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
                       <button onClick={()=>{setChange(true);setLpage("seach");toPage('bomb')}}>Bombeiros</button>
                       <button onClick={()=>{setChange(true);setLpage("seach");toPage('call')}}>Ocorrências</button>
                       <button onClick={()=>{setChange(true);setLpage("seach");toPage('report')}}>Atendimento</button>
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