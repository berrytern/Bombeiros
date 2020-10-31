const {gen_token, auth} = require('./token')
const User=require('../models/user')
const Bomb=require('../models/bombeiro')
const UserBomb=require('../models/users_bomb')
const Call=require('../models/call')
const Report=require('../models/report');
const { Op } = require("sequelize");
const {io} = require('../connection')
const path = require('path');
const {getLocation} = require('./location')
module.exports = app=>{
    app.get('/verify',async(req,res)=>{
        console.log('/verify --get',req.query)
        const {email,code,id}=req.query;
        if(!!email && code&& id){
            User.findOne({where:{email:{[Op.eq]: email}}}).then(e=>{
                if(!!e){
                    if(parseInt(code,10)==e.getDataValue('code')&&e.getDataValue('exp')>=Date.now()/1000){
                        const token=gen_token({email:email})
                        io.to(id).emit('token', {token:token});
                        res.sendFile(path.join(path.resolve(__dirname , '../page.html')));
                    }else{
                        res.sendFile(path.join(path.resolve(__dirname , '../page_exp.html')));
                    }
                }else{                    
                    res.status(404).send()
                }
            })
        }else{
            res.status(400).send()
        }
    })
    app.post('/validate',auth(),async(req,res)=>{
        console.log('/validate --post')
        res.status(200).send()
    })
    app.post('/bombeiro/create',auth(),async(req,res)=>{
        console.log('/bombeiro/create --post',req.body)
        const {name,location,fire,rescue,salvage} = req.body;
        if(!!name && !!location && !!fire && !!rescue && !!salvage){
            const result=await getLocation(location);
            if(result.status==200){
                const {streetName,streetNumber,state,city,longitude,latitude,neighborhood,country,zipcode}=result;
                if(!!streetName&&!!zipcode){
                    if(!!streetNumber){
                        const defaultBomb={
                        name:name,
                        streetName:streetName,
                        streetNumber:streetNumber,
                        state:state,
                        city:city,
                        latitude:latitude,
                        longitude:longitude,
                        neighborhood:neighborhood,
                        country:country,
                        zipcode:zipcode,
                        fire:fire,
                        currentFire:fire,
                        rescue:rescue,
                        currentRescue:rescue,
                        salvage:salvage,
                        currentSalvage:salvage,
                        };
                        const [find,created]=await Bomb.findOrCreate({where:{
                                country:{[Op.eq]:country},zipcode:{[Op.eq]:zipcode},streetName:{[Op.eq]:streetName},streetName:{[Op.eq]:streetNumber}
                            },defaults:defaultBomb
                        });
                        if(created){
                            UserBomb.create({BombId:find.id,UserId:req.user.id}).then(e=>{
                                if(!!e){
                                    res.status(201).json({"id":find.id,"relation_id":e.id,"token":req.user.token})
                                }else{
                                    res.status(500).json({"message":"Bomb created, relation to User failed!","token":req.user.token})
                                }
                            }).catch(i=>{res.status(500).send()})
                        }else{
                            res.status(409).json({"token":req.user.token})
                        }
                    }else{
                        res.status(400).json({"err":"must have street number","token":req.user.token})
                    }
                }else{
                    res.status(400).json({"err":"must have street","token":req.user.token})
                }
            }else{res.status(404).json({"token":req.user.token})}
        }else{
            res.status(400).json({"token":req.user.token})
        }  
    })
    app.post('/call/create',auth(),async(req,res)=>{
        console.log('/call/create --post');
        const {type,problem,requirements,timeToEnd,address,priority}=req.body;
        console.log(type,requirements,timeToEnd,address,priority,req.body)
        if(!!type&&!!requirements&&!!timeToEnd&&!!address&&!!priority){
            const result=await getLocation(address);
            if(result.status==200){
                const {streetName,streetNumber,state,city,longitude,latitude,neighborhood,country,zipcode}=result;
                User.findOne({where:{email:{[Op.eq]: req.user.email}},include:Bomb}).then(u=>{
                    let Bombs=u.Bombs.map(i=>{return {id:i.id}})
                    Call.create({longitude:longitude,latitude:latitude,type:type,problem:problem,requirements:requirements,timeToEnd:timeToEnd
                        ,streetName:streetName,
                        streetNumber:streetNumber,
                        city:city,priority:priority,UserId:req.user.id}).then(e=>{
                        const defaultReport={
                            origem:'Default',
                            dest:'Catolé, campina grande',
                            wayPoint:'cruzeiro, campina grande',
                            time:[5*60,e.timeToEnd,6*60],
                            CallId:e.id,
                        };
                        Report.create({})
                        res.status(201).send()
                    }).catch(e=>{console.log('e')})
                    })
                }else{

                }
            
        }else{
            res.status(400).json({"token":req.user.token})
        }
    })
}