const fetch = require('node-fetch')
const Bomb = require('./models/bombeiro')
const Call=require('./models/call');
const Report=require('./models/report')
const {Op}=require('sequelize');
const User = require('./models/user');
const algoritmo= require('./Dijkstra')
const convert=(txt)=>encodeURI(txt).split(',').join('%2C')
const format=(txt)=>txt.split(' ').join('+').split('.').join('').split('Ç').join('C').split('Ô').join('O').split('Õ').join('O').split('Ó').join('O')
          .split('Â').join('A').split('Ã').join('A').split('Á').join('A').split('À').join('A')
          .split('Ê').join('E').split('É').join('E').split('È').join('E')
          .split('Î').join('I').split('Í').join('I').split('Û').join('U').split('Ú').join('U').split('Ù').join('U')
const D=(dist,tempo,urg=1)=>{
    if(urg==1 || urg==2){
        return ((dist/27)+(tempo/20))/3
    }else{
        return (tempo/20)/3
    }
}
const F=(km,min,inuse=0,total=1,urg=1)=>{
    if(urg==1){
        return (D(km,min,urg)*2)+((inuse/total)/9)
    }if(urg==2){
        return (D(km,min,urg)*2)+((inuse/total)/11)
    }if(urg==3){
        return (D(km,min,urg)*2)+((inuse/total)/14)
    }if(urg==4){
        return (D(km,min,urg)*2)
    }
}      
module.exports = async()=>{
    await User.findAll().then(async obj=>{
        let b;
        for(b=0;b<obj.length;b++){
            const u=await User.findOne({where:{id:{[Op.eq]:obj[b].id}},include:Bomb})
            let origem='';
            const bombs= u.Bombs.map((i,index)=>{
                if(index<u.Bombs.length-1){
                    let latitude=i.latitude
                    origem+=`${latitude},${i.longitude}|`
                }else{
                    origem+=`${i.latitude},${i.longitude}`
                }
                return {id:i.id,longitude:i.longitude,latitude:i.latitude,index:index}});
            let dest=''
            origem=origem.toUpperCase()
            const calls=await Call.findAll({where:{UserId:{[Op.eq]:obj[b].id},status:{[Op.eq]:false}}})
            let z;
            for(z=0;z<calls.length;z++){
                let i=calls[z]
                let dest=`${i.latitude},${i.longitude}`
                dest=dest.toUpperCase()
                let go = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${origem}&destinations=${dest}&key=AIzaSyB1MhfDz7x85UyTWQEqtAnKy_4aUwt2HDI`,{method:'GET'}).then(res=>res.json()).then(json=>json)
                let less;
                go = go.rows.map((i,index)=>{
                    i=i.elements[0]
                    if(index==0){
                        less={distance:i.distance.value,duration:i.duration.value,index:index}
                    }else{
                        if(less.distance>i.distance.value&&less.duration>i.duration.value){
                            less={distance:i.distance.value,duration:i.duration.value,index:index}
                        }
                    }
                    return {go_distance:i.distance.value,go_duration:i.duration.value,index:index}
                })
                let back = await fetch(`https://maps.googleapis.com/maps/api/distancematrix/json?origins=${dest}&destinations=${origem}&key=AIzaSyB1MhfDz7x85UyTWQEqtAnKy_4aUwt2HDI`,{method:'GET'}).then(res=>res.json()).then(json=>json)
                back=back.rows[0].elements.map((i,index)=>{
                    if(index==0){
                        less={distance:i.distance.value,duration:i.duration.value,index:index}
                    }else{
                        if(less.distance>i.distance.value&&less.duration>i.duration.value){
                            less={distance:i.distance.value,duration:i.duration.value,index:index}
                        }
                    }
                    return {back_distance:i.distance.value,back_duration:i.duration.value,index:index}
                })
                let final=[];
                //let reports=await Report.findAll({where:{BombId:{[Op.eq]:h.id}}})
                //reports=reports.map
                let d
                less=-1
                for(d=0;d<bombs.length;d++){
                    let x;
                    //console.log('bomb id: ',bombs[d].id)
                    let rp=await Report.findAll({where:{BombId:{[Op.eq]:1}, end:{[Op.gt]:Math.floor(Date.now()/1000)}},raw: true})
                    let n=0;
                    //console.log(rp)
                    for(x=0;x<rp.length;x++){
                        t=await Call.findOne({where:{id:{[Op.eq]:rp[x].CallId}}})
                        n+=t.requirements
                    }
                    rp.map((i,index)=>{
                    })
                    let h=await Bomb.findOne({where:{id:{[Op.eq]:bombs[d].id}}})
                    if(i.type=="fire"){
                        h=(({ id, latitude,longitude, fire,streetName,streetNumber,city}) => ({ id, latitude,longitude, ...{able:fire,origem:streetName+', '+streetNumber+', '+city}}))(h);
                    }else if(i.type=="rescue"){
                        h=(({ id, latitude,longitude, rescue,streetName,streetNumber,city}) => ({ id, latitude,longitude, ...{able:rescue,origem:streetName+', '+streetNumber+', '+city}}))(h);
                    }else{
                        h=(({ id, latitude,longitude, salvage,streetName,streetNumber,city}) => ({ id, latitude,longitude, ...{able:salvage,origem:streetName+', '+streetNumber+', '+city}}))(h);
                    }
                    if((h.able-n)>=i.requirements){
                        //console.log((go[d].go_distance+back[d].back_distance)/1000,(go[d].go_duration+back[d].back_duration)/60,n,h.able,i.priority)
                        
                        let calc=F((go[d].go_distance+back[d].back_distance)/1000,(go[d].go_duration+back[d].back_duration)/60,n,h.able,i.priority)
                        //if(less==-1){
                        //    less=calc
                        //}else if(calc<less){
                        //    less=calc
                        //}
                        final.push({...go[d],...back[d],...{timeToEnd:i.timeToEnd,inuse:n,peso:calc},...h})
                    }
                }
                let selected=algoritmo(final)
                let now=Math.floor(Date.now()/1000)
                let lat=calls[z].latitude-(calls[z].latitude-(selected.latitude))/2
                let lon=calls[z].longitude-(calls[z].longitude-(selected.longitude))/2
                console.log(lat,lon)
                let destin=calls[z].streetName+', '+calls[z].streetNumber+', '+calls[z].city
                let base64=await fetch(convert(`http://127.0.0.1:8000/?origem=${selected.origem}&dest=${destin}&lat=${lat}&lon=${lon}`)).then(res => res.json()).then(body=>body[0])
                let example={
                    origem:selected.origem,
                    dest:destin,
                    time:[selected.go_duration,selected.timeToEnd,selected.back_duration],
                    end:now+Math.floor(selected.go_duration+ selected.timeToEnd+selected.back_duration),
                    inuse:selected.inuse,
                    able:selected.able,
                    img: base64,
                    CallId:calls[z].id,
                    BombId:selected.id,
                    UserId:obj[b].id,
                }
                await Report.create(example)
                calls[z].status=true
                calls[z].save()
            }
        
        }
    }).catch(e=>console.log('e'))
    //User.findAll({where:{status:{[Op.eq]:false}}}).then(obj=>{
    //    
    //    
    //})
}