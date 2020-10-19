import React from 'react'
import '../_listLayout/List.css'

export default (props)=>{
    const getValues=()=>{
        const result=props.seach.input.map((obj)=>{return[obj.name,obj.value]})
        return result;
    }
    return (
        <div className="ILMaior">
            {props.page=="seach"&&<>
            <div className="seach">
                <div className="inputs">
                    {props.seach.input.map((obj)=>(!!obj.option?
                    <select value={obj.value} onChange={(i)=>{obj.setValue(i.target.value)}}>
                        <option value="" disabled></option>
                        {obj.option.map((opt)=><option value={opt}>{opt}</option>)}
                    </select>:
                    <input style={{width:obj.width}} placeholder={obj.name} onChange={(i)=>{obj.setValue(i.target.value)}} value={obj.value}></input>))}
                </div>
                <img onClick={()=>{props.setPage("create")}}/>
            </div>
            <div className="rseach">
                <div className="rdesc">
                {props.seach.input.map((obj,index)=><div style={{flex:obj.width/10}} className={index<props.seach.input.length-1?"bend":"end"}><label>{obj.name}</label></div>)}
                </div>
                <div className="rlist">
                    <div></div>
                </div>
            </div>
    <div className="desc"><div><label>{props.seach.input.map((obj)=>obj.sigla+" - "+obj.name+"; ")}</label></div></div></>}
            {props.page=="create"&&<>
            <label>ddddddddd</label>
            </>}
        </div>
    )
}