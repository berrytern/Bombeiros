import React,{createContext,useContext} from 'react'
import '../_listLayout/List.css'
import {Context} from '../_control/Control'

const ContextMap=createContext();
export default (props)=>{
    const {dropbox,setDropbox,pg,next,setPg,result,seach,setSeach,setChange,selected,options,setSelected}=useContext(Context)
    props=props.p
    if(!!seach){
        props.seach.do()
        if(props.seach.load===true){
            props.seach.input.map((obj)=>{return typeof(obj.do)=='function'?obj.do():null})
        }
        setSeach(false)
    }
    return (
        <div className="ILMaior">
            {props.page=="seach"&&<>
            <div className="seach">
                <div className="inputs">
                    {props.seach.input.map((obj,index)=>(!!obj.option? obj.option==true?
                    <select style={{width:obj.width}} value={selected} placeholder={obj.name} onChange={(i)=>{setSelected(i.target.value);props.seach.do([i.target.value,index])}}>
                        <option value="" >{obj.name}</option>
                        {options.map((opt)=><option value={opt}>{opt}</option>)}
                    </select>:
                    <select value={obj.value} onChange={(i)=>{obj.setValue(i.target.value);props.seach.do([i.target.value,index])}}>
                        <option value="" >{obj.name}</option>
                        {obj.option.map((opt)=><option value={opt}>{opt}</option>)}
                    </select>:
                    <input style={{width:obj.width}} placeholder={obj.name} onChange={async(i)=>{obj.setValue(i.target.value);props.seach.do([i.target.value,index]);}} value={obj.value}></input>))}
                </div>
                    {props.create.input.length>0?<img onClick={()=>{setChange(true);props.setPage("create")}}/>:<></>}
            </div>
            <div className="rseach">
                <div className="rdesc">
                {props.seach.input.map((obj,index)=><div style={{width:obj.width+((props.create.input.length>0?54:10)/props.seach.input.length)}} className={index<props.seach.input.length-1?"bend":"end"}><label>{obj.sigla}</label></div>)}
                </div>
                <div className="rlist">
                    {
                        result.map((obj,index)=>{
                            console.log(obj)
                            if(Array.isArray(obj)){
                                return(<div className="item">{obj.map((item,index)=>(<div style={{width:props.seach.input[index].width+54/props.seach.input.length}} className={index<props.seach.input.length-1?"bend":"end"}><label>{item}</label></div>))}</div>)
                            }else{
                                return dropbox[index]==true?
                                <div style={{display:'flex', flexDirection: "column"}}>
                                    <button onClick={()=>{setDropbox(dropbox.map((i,n)=>{return n==index?false:i}))}}>^</button>
                                    <div style={{display:'flex', flexDirection: "row"}}>
                                        <img style={{ margin:38,height: 100,width: 100,border: 'solid 1px white'}} src={"data:image/png;base64, "+obj.ondrop.img}/><div style={{display: 'flex', flexDirection: 'column',alignItems:'flex-end'}}>{Object.keys(obj.ondrop).filter(n=>n!='img').map(n=><div><label style={{width:70}}>{n}</label><input style={{font: 'bold 7pt Arial'}} placeholder={obj.ondrop[n]} disabled/></div>)}</div>
                                    </div>
                                </div>
                                :(<div className="item">{obj.fields.map((item,index)=>(<div style={{width:props.seach.input[index].width+9/props.seach.input.length}} className={index<props.seach.input.length-1?"bend":"end"}><label>{item}</label></div>))}<button style={{width:30}} onClick={()=>{setDropbox(dropbox.map((i,n)=>{
                                    return n==index?true:i}));console.log('dropbox',dropbox)}}>V</button></div>)
                            }   
                        })
                    }
                        
                </div>
            </div>
                    <div className="pg">{pg>1?<button onClick={()=>{setPg(pg-1)}}>before</button>:<button disabled>before</button>}<button className="pg" disabled>{pg}</button>{next?<button onClick={()=>{setPg(pg+1)}}>after</button>:<button disabled>after</button>}</div>
            <div className="desc"><div><label>{props.seach.input.map((obj)=>obj.sigla+" - "+obj.name+"; ")}</label></div></div></>}
            {props.page=="create"&&
            <div className="create">
                    {props.create.input.map((obj)=>{
                        return !!obj.option? obj.option===true?
                        <div className="inputs"><label>{obj.name+":"}</label>
                        <select value={selected} onChange={(i)=>{setSelected(i.target.value)}}>
                        <option value="" disabled></option>
                        {options.map((opt)=><option value={opt}>{opt}</option>)}
                        </select></div>:
                        <div className="inputs"><label>{obj.name+":"}</label>
                        <select value={obj.value} onChange={(i)=>{obj.setValue(i.target.value)}}>
                        <option value="" disabled></option>
                        {obj.option.map((opt)=><option value={opt}>{opt}</option>)}
                    </select></div>:
                        <div className="inputs"><label>{obj.name+":"}</label><input onChange={(i)=>{obj.setValue(i.target.value)}}placeholder={obj.name}></input></div>})}
                <div className="action">
                    <button className="save" onClick={()=>{props.create.do();setSeach(true);setChange(true);setTimeout(()=>props.seach.do(),1000)}}>Save</button>
                    <button className="cancel" onClick={()=>{setChange(true);setSeach(true);props.setPage("seach")}}>Cancel</button>
                </div>
            </div>
            }
        </div>
    )
}