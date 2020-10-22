import React,{useContext} from 'react'
import '../_listLayout/List.css'
import {Context} from '../_control/Control'
export default (props)=>{
    const {result,seach,setSeach}=useContext(Context)
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
                    {props.seach.input.map((obj)=>(!!obj.option?
                    <select value={obj.value} onChange={(i)=>{props.seach.do();obj.setValue(i.target.value)}}>
                        <option value="" disabled></option>
                        {obj.option.map((opt)=><option value={opt}>{opt}</option>)}
                    </select>:
                    <input style={{width:obj.width}} placeholder={obj.name} onChange={(i)=>{console.log(result);props.seach.do();obj.setValue(i.target.value)}} value={obj.value}></input>))}
                </div>
                <img onClick={()=>{props.change(true);props.setPage("create")}}/>
            </div>
            <div className="rseach">
                <div className="rdesc">
                {props.seach.input.map((obj,index)=><div style={{flex:obj.width/10}} className={index<props.seach.input.length-1?"bend":"end"}><label>{obj.name}</label></div>)}
                </div>
                <div className="rlist">
                    {result.map((obj)=>(<div className="item">{obj.map((item,index)=>(<div style={{flex:props.seach.input[index].width/10}} className={index<props.seach.input.length-1?"bend":"end"}><label>{item}</label></div>))}</div>))}
                </div>
            </div>
            <div className="desc"><div><label>{props.seach.input.map((obj)=>obj.sigla+" - "+obj.name+"; ")}</label></div></div></>}
            {props.page=="create"&&
            <div className="create">
                    {props.create.input.map((obj)=>{
                        return !!obj.option? 
                        <div className="inputs"><label>{obj.name+":"}</label>
                        <select value={obj.value} onChange={(i)=>{obj.setValue(i.target.value)}}>
                        <option value="" disabled></option>
                        {obj.option.map((opt)=><option value={opt}>{opt}</option>)}
                    </select></div>:
                        <div className="inputs"><label>{obj.name+":"}</label><input onChange={(i)=>{obj.setValue(i.target.value)}}placeholder={obj.name}></input></div>})}
                <div className="action">
                    <button className="save" onClick={()=>{props.create.do()}}>Save</button>
                    <button className="cancel" onClick={()=>props.setPage("seach")}>Cancel</button>
                </div>
            </div>
            }
        </div>
    )
}