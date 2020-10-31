estimativa= Infinity


const inserir_bomb=(id,peso, vertice, aresta)=>{
    if(vertice.filter(i=>i.id==id).length==0){
        vertice.push({
            id:id,
            peso:Infinity,
            aberto:true
        })
        aresta.push({
            id:-1,
            to:id,
            peso:0,
            aberto:true
        })
        aresta.push({
            id:id,
            to:Infinity,
            peso:peso,
            aberto:true
        })
        return [vertice, aresta]
    }else{
        console.log('bomb already exist')
        return []
    }
}



const algoritmo = (list)=>{
    let vertice=[{id:-1,peso:0,aberto:true},{id:Infinity,peso:Infinity,aberto:true}]
    let aresta=[]
    let b;
    for(b=0;b<list.length;b++){
        [vertice,aresta]=inserir_bomb(list[b].id,list[b].peso,vertice, aresta)
    }
    while(vertice.filter(i=>i.aberto).length>0){
        let less={id: Infinity,peso:Infinity};
        //console.log(vertice)
        //define o menor peso
        vertice.filter(i=>i.aberto).map(i=>{if(i.peso<less.peso){less=i} return i})
        //fecha o vertice
        //console.log('vertice antes : ',vertice)
        vertice=vertice.map(i=>{if(i.id==less.id){return {...i,aberto:false}}else{return i}})
        //console.log('fechando o vertice id=',less.id,' : ',vertice)
        let to_close=aresta.filter(i=>i.id==less.id&&i.aberto).map(i=>{
            vertice=vertice.map(v=>{if(v.id==i.to&&v.peso>i.peso){return {...v,peso:i.peso}}else{return v}})
            return {id:i.id,to:i.to}
        })
        //console.log('aresta antes: ',aresta)
        aresta = aresta.map(i=>{ if(to_close.map(i=>i.id).includes(i.id)&&to_close.map(i=>i.to).includes(i.to)){return {...i,aberto:false}}else{return i}})
        //console.log('to_close: ',to_close)
        //console.log('fechando aresta: ',aresta)
        
        
    }
    return list.filter(j=>j.id==aresta.filter(i=>i.peso==vertice.filter(n=>n.id==Infinity)[0].peso)[0].id)[0]
}

module.exports=algoritmo