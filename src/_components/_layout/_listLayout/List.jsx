import React,{useContext} from 'react'
import '../_listLayout/List.css'
import {Context} from '../_control/Control'
export default (props)=>{
    const {result,seach,setSeach,setChange,option}=useContext(Context)
    props=props.p
    if(!!seach){
        props.seach.do()
        setSeach(false)
    }
    return (
        <div className="ILMaior">
            {props.page=="seach"&&<>
            <div className="seach">
                <div className="inputs">
                    {props.seach.input.map((obj,index)=>(!!obj.option?
                    <select value={obj.value} onChange={(i)=>{obj.setValue(i.target.value);props.seach.do([i.target.value,index])}}>
                        <option value=""></option>
                        {obj.option.map((opt)=><option value={opt}>{opt}</option>)}
                    </select>:
                    <input style={{width:obj.width}} placeholder={obj.name} onChange={async(i)=>{obj.setValue(i.target.value);props.seach.do([i.target.value,index]);}} value={obj.value}></input>))}
                </div>
                <img onClick={()=>{setChange(true);props.setPage("create")}}/>
            </div>
            <div className="rseach">
                <div className="rdesc">
                {props.seach.input.map((obj,index)=><div style={{width:obj.width+(54/props.seach.input.length)}} className={index<props.seach.input.length-1?"bend":"end"}><label>{obj.name}</label></div>)}
                </div>
                <div className="rlist">
                    {result.map((obj)=>(<div className="item">{obj.map((item,index)=>(<div style={{width:props.seach.input[index].width+54/props.seach.input.length}} className={index<props.seach.input.length-1?"bend":"end"}><label>{item}</label></div>))}</div>))}
                </div>
            </div>
            <div className="desc"><div><label>{props.seach.input.map((obj)=>obj.sigla+" - "+obj.name+"; ")}</label></div></div></>}
            {props.page=="create"&&
            <div className="create">
                    {props.create.input.map((obj)=>{
                        return !!obj.option? obj.option==true?
                        <div className="inputs"><label>{obj.name+":"}</label>
                        <select value={obj.value} onChange={(i)=>{obj.setValue(i.target.value)}}>
                        <option value="" disabled></option>
                        {option.map((opt)=><option value={opt}>{opt}</option>)}
                        </select></div>:
                        <div className="inputs"><label>{obj.name+":"}</label>
                        <select value={obj.value} onChange={(i)=>{obj.setValue(i.target.value)}}>
                        <option value="" disabled></option>
                        {obj.option.map((opt)=><option value={opt}>{opt}</option>)}
                    </select></div>:
                        <div className="inputs"><label>{obj.name+":"}</label><input onChange={(i)=>{obj.setValue(i.target.value)}}placeholder={obj.name}></input></div>})}
                <div className="action">
                    <button className="save" onClick={()=>{props.create.do();setChange(true);setTimeout(()=>props.seach.do(),400)}}>Save</button>
                    <button className="cancel" onClick={()=>{setChange(true);props.setPage("seach")}}>Cancel</button>
                </div>
            </div>
            }
        </div>
    )
}