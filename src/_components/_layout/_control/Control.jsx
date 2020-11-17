import React,{createContext,useContext} from 'react';
import io from 'socket.io-client'
import './Control.css'
import '../_loginLayout/Login.css'
import List from '../_listLayout/List'

const Context=createContext();
const url= "http://localhost:4000";
const Control=(props)=>{
    const [pg,setPg]=React.useState(1);
    const [next,setNext]=React.useState(false);
    const [dropbox,setDropbox]=React.useState([]);
    const [option, setOption]=React.useState([])
    const [selected, setSelected]=React.useState('')
    const [problem, setProblem]=React.useState('')
    const [result, setResult]=React.useState([])
    const [seach, setSeach]=React.useState(true)
    const [change, setChange]=React.useState(true)
    const [zipcode,setZipcode]=React.useState('')
    const [name,setName]=React.useState('');
    const [address,setAddress]=React.useState('')
    const [streetName,setStreetName]=React.useState('')
    const [streetNumber,setStreetNumber]=React.useState('')
    const [city,setCity]=React.useState('')
    const [state,setState]=React.useState('')
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
    const [email,setEmail]=React.useState('teste@teste.com')
    const [token,setToken]=React.useState(localStorage.getItem('token'))
    React.useEffect(()=>{
        if(change==true){
            console.log('window.google: ',window.google)
            console.log(page,lpage)
            if(lpage=="create"){
                if(page=="bomb"){
                    setName("")
                }
                if(page=="call"){
                    console.log('window.google: ',window.google)
                    setType('')
                    setPriority('')
                }
                setChange(false)
            }
            if(lpage=="seach"){
                if(page=="bomb"){
                    setName("")
                    setZipcode("")
                    setAddress("")
                    setNeighborhood("")
                    setCountry("")
                }
                if(page=="call"){
                    setZipcode("")
                    setType("")
                    setStreetName("")
                    setStreetNumber("")
                    setPriority("")
                    setSelected('')
                }
                if(page=="report"){
                    setName('')
                    setBegin('')
                    setEndpoint('')
                }
                setSeach(true)
                setChange(false)
            }
            
            
        } 
        return ()=>{
        }
    })
    const validate=(req,callback,err=()=>{})=>{
        if(typeof(callback)=="function"){
            console.log(req.status,req.response)
            if(req.status==401){
                toAuth(true)
            }else if(req.status==201){
                callback();
            }else{
                const json=JSON.parse(req.responseText);
                console.log(json)
                if(!!json['token']){
                    setToken(json['token']);
                    callback(json);
                }else{
                    err()
                }
            }
        }else{
            const json=JSON.parse(req.responseText);
            if(!!json['token']){
                return json;
            }else{return false}
        }
        
        
    }
    //--------------------------------- bomb ------------------------
    const bomb={
        page:lpage,
        setPage:setLpage,
        seach:{
            input:[
                {
                    name:'CEP',
                    sigla:"CEP",
                    width:70,
                    value:zipcode,
                    setValue:setZipcode,
                },{
                    name:'Nome',
                    sigla:"NM",
                    width:90,
                    value:name,
                    setValue:setName,
                },{
                    name:'Nome da Rua',
                    sigla:"NR",
                    width:200,
                    value:streetName,
                    setValue:setStreetName,
                },{
                    name:'Número',
                    sigla:"NB",
                    width:60,
                    value:streetNumber,
                    setValue:setStreetNumber,
                },{
                    name:'Bairro',
                    sigla:"BR",
                    width:120,
                    value:neighborhood,
                    setValue:setNeighborhood,
                }
            ],
            do:(i)=>{
                let algo=[zipcode,name,streetName,streetNumber,neighborhood]
                if(!!i){algo[i[1]]=i[0];}
                console.log(algo)
                const socket=io(url)
                socket.emit("bombs",[token,pg,algo])
                socket.on("bombs",(list,next,tk)=>{
                    if(list===false){
                        toAuth(true)
                    }else{
                    setResult(list)
                    setNext(next)
                    if(!!tk){setToken(tk)}
                    }
                })
            },
        },
        create:{
            input:[
                {name:'Name',
                value:name,
                setValue:setName},
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
                console.log(name,c_address,fire,rescue,salvage)
                if(!!name&&!!c_address&&!!fire&&!!rescue&&!!salvage){
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
                            const json=`{"name":"${name}","location":"${c_address}","fire":${fire},"rescue":${rescue},"salvage":${salvage}}`
                            console.log(json)
                            req.send(json)
                            req.onload=()=>{
                                validate(req,()=>{
                                    console.log(req.status)
                                    if(req.status==201){
                                        setLpage("seach");
                                    }else{
                                        alert("status: "+req.status);
                                    }
                                },()=>{
                                    console.log(token)
                                    toAuth(true);
                                })
                            }
                        }catch(e){
                            alert("failed request!!!");
                        }
                    }
                }else{
                    console.log("there are fields empty");
                }
            }
        },
    };
    //--------------------------------- call ------------------------
    const call={
        page:lpage,
        setPage:setLpage,
        seach:{
            input:[
                {
                    name:'Tipo',
                    sigla:"TP",
                    width:70,
                    option: ['fire','rescue','salvage'],
                    value:type,
                    setValue:setType,
                },{
                    name:'Problema',
                    sigla:"PB",
                    width:120,
                    value:problem,
                    setValue:setProblem,
                },{
                    name:'Nome da Rua',
                    sigla:"NR",
                    width:130,
                    value:streetName,
                    setValue:setStreetName,
                },{
                    name:'Número',
                    sigla:"NM",
                    width:60,
                    value:streetNumber,
                    setValue:setStreetNumber,
                },{
                    name:'Prioridade',
                    sigla:"PR",
                    width:79,
                    option:['1','2','3','4'],
                    value:priority,
                    setValue:setPriority,
                }
            ],
            do:(i)=>{
                let algo=[type,problem,streetName,streetNumber,priority]
                if(!!i){algo[i[1]]=i[0];}
                console.log(algo)
                const socket=io(url)
                socket.emit("calls",[token,pg,algo])
                socket.on("calls",(list,next,tk)=>{
                    console.log(list,next)
                    if(list===false){
                        toAuth(true)
                    }else{
                        setResult(list)
                        setNext(next)
                        if(!!tk){setToken(tk)}
                    }
                })
            },
        },
        create:{
            input:[
                {name:'tipo',
                option:['fire','rescue','salvage'],
                value:type,
                setValue:setType},
                {name:'problema',
                value:problem,
                setValue:setProblem},
                {name:'requirementos',
                value:requirements,
                setValue:setRequirements},
                {name:'tempo_para_finalizar',
                value:timeToEnd,
                setValue:setTimeToEnd},
                {name:'endereço',
                value:address,
                setValue:setAddress},
                {name:'prioridade',
                option:['1','2','3','4'],
                value:priority,
                setValue:setPriority}
            ],
            do:()=>{
                console.log(type,problem,requirements,timeToEnd,address,priority)
                if(!!type&&!!problem&&!!requirements&&!!timeToEnd&&!!address&&!!priority){
                    if(!isNaN(address)){
                        alert("address can not be a number!!!");
                    }else if(address.length<10){
                        alert("address must have more than 10 characters!!!");
                    }else if(!isNaN(problem)){
                        alert("problem can not be a number!!!");
                    }else if(problem.length<4){
                        alert("problem must have more than 4 characters!!!");
                    }else if(isNaN(requirements)){
                            alert("Requirements must be a Number");
                    }else if(isNaN(timeToEnd)||!timeToEnd){
                        alert("TimeToEnd must be a Number");
                    }else if(isNaN(priority)||!priority||priority>4||priority<1){
                        alert("Priority must be a Number");
                    }else{
                        try{
                            const req=new XMLHttpRequest();
                            req.open('POST',url+"/call/create");
                            req.setRequestHeader('Content-Type','application/json');
                            req.setRequestHeader('Authorization','Beare '+token)
                            const json=`{"type":"${type}","problem":"${problem}","requirements":${requirements},"timeToEnd":${timeToEnd*60},"address":"${address}","priority":${priority}}`
                            console.log(json)
                            req.send(json)
                            req.onload=()=>{
                                validate(req,(json)=>{
                                    console.log(req.status)
                                    if(req.status==201){
                                        setLpage("seach");
                                    }else{
                                        alert("status: "+req.status);
                                    }
                                },()=>{
                                    toAuth(true);
                                })
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
    };
    //--------------------------------- report ------------------------
    const report={
        page:lpage,
        setPage:setLpage,
        seach:{
            input:[
                {
                    name:'Nome Bombeiro',
                    sigla:"NB",
                    width:170,
                    value:selected,
                    option:true,
                    do:()=>{
                        const socket=io(url)
                        socket.emit('names',token)
                        socket.on('names',list=>{
                            if(list===false){
                                toAuth(true)
                            }else{
                                setOption(list)
                            }
                        })
                    },
                    setValue:setSelected,
                },{
                    name:'Destino',
                    sigla:"DEST",
                    width:170,
                    value:endpoint,
                    setValue:setEndpoint,
                }
            ],
            do:(i)=>{
                let algo=[selected,endpoint]
                if(!!i){algo[i[1]]=i[0];}
                console.log(algo)
                const socket=io(url)
                socket.emit('reports',[token,pg,algo])
                socket.on('reports',(list,next,tk)=>{
                    if(list===false){
                        toAuth(true)
                    }else{
                        setDropbox(list.map(i=>i.drop))
                        setNext(next)
                        setResult(list)
                        if(!!tk){setToken(tk)}
                    }
                })
            },
            load:true
        },
        create:{
            input:[
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
    return(
    <>{!auth&&
        <div className="container">
            <div className="logo">
                <div className="imgEmail"></div>
                <span>{email}</span>
            </div>
        
            <div className="controlData">
                <div className="lateralMenor">
                    <div className="navTabs">
                       <button onClick={()=>{setResult([]);setChange(true);setLpage("seach");toPage('bomb')}}>Bombeiros</button>
                       <button onClick={()=>{setResult([]);setChange(true);setLpage("seach");toPage('call')}}>Ocorrências</button>
                       <button onClick={()=>{setResult([]);setChange(true);setLpage("seach");toPage('report')}}>Atendimento</button>
                    </div>

                </div>

                <div className="lateralMaior">
                    {page=="logo"&&
                        <div className="lateralMaior"><div className="img2"></div>
                            <span></span>
                        </div>}
                    <Context.Provider value={{dropbox:dropbox,setDropbox:setDropbox,result:result,setSeach:setSeach,seach:seach,pg:pg,setPg:setPg,setChange:setChange,options:option,setSelected:setSelected,selected:selected,pg:pg,setPg:setPg}}>
                        {page=="bomb"&&<List p={bomb}/>}
                        {page=="call"&&<List p={call}/>}
                        {page=="report"&&<List p={report}/>}
                    </Context.Provider>
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
export {Context,Control}