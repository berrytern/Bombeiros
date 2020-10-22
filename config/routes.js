const {gen_token, auth} = require('./token')
const User=require('../models/user')
const Bomb=require('../models/bombeiro')
const UserBomb=require('../models/users_bomb')
const Call=require('../models/call')
const Group=require('../models/group')
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
        const {location,fire,rescue,salvage} = req.body;
        if(!!location && !!fire && !!rescue && !!salvage){
            const result=await getLocation(location);
            if(result.status==200){
                const {address,longitude,latitude,neighborhood,country,zipcode}=result;
                if(!!zipcode){
                    const [find,created]=await Bomb.findOrCreate({where:{
                            neighborhood:{[Op.eq]:neighborhood},country:{[Op.eq]:country},zipcode:{[Op.eq]:zipcode}
                        },defaults:{
                            address:address,latitude:latitude,longitude:longitude,neighborhood:neighborhood,country:country,zipcode:zipcode,
                        }
                    });
                    console.log("created: ",created,", find: ",find)
                    if(find){
                        console.log(find.id,created.id,"ids")
                        const defaultGroup={
                        fire:fire,
                        currentFire:fire,
                        rescue:rescue,
                        currentRescue:rescue,
                        salvage:salvage,
                        currentSalvage:salvage,
                        BombId:find.id,
                        };
                        Group.create(defaultGroup).then(
                            i=>{
                                if(!!i){
                                    UserBomb.create({BombId:find.id,UserId:req.user.id}).then(e=>{
                                        if(!!e){
                                            res.status(201).json({"id":find.id,"relation_id":e.id,"token":req.user.token})
                                        }else{
                                            res.status(500).json({"message":"Bomb created, relation to User failed!","token":req.user.token})
                                        }
                                    }).catch(i=>{res.status(409).send()})
                                }else{
                                    res.status(500).json({"err":"on create Group","token":req.user.token})
                                }
                            }
                        ).catch(e=>{res.status(409).json({"token":req.user.token})})
                    }else{
                        res.status(400).json({"err":"must be precise","token":req.user.token})
                    }
                }else{
                    res.status(400).json({"token":req.user.token})
                }
            }else{res.status(404).json({"token":req.user.token})}
        }else{
            res.status(400).json({"token":req.user.token})
        }  
    })
    app.post('/group/create',async(req,res)=>{
        const {bombId,fire,rescue,salvage}=req.body;
        const exists=await Bomb.findByPk(bombid);
        if(!!exists){
            const success=await Group.create({BombId:bombId,fire:fire,rescue:rescue,salvage:salvage})
            if(!!success){
                res.status(201).json({"id":success.id});
            }else{
                res.status(500).send();
            }
        }else{
            res.status(404).send();
        }
    })
    app.post('/call/create',(req,res)=>{
        console.log('/call/create --post');
        const {groupId,type,requirements,timeToEnd}=req.body;
        if(!!groupId&&!!type&&!!requirements&&!!timeToEnd)
        Call.create
    })
}