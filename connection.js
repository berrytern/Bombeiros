const api = require('express')()
const server = require('http').createServer(api)
const io =require('socket.io')(server)
const {randomCode} = require('./config/gmail')
const User=require('./models/user')
const { Op } = require("sequelize");
const dotoken = require('./config/token')
const Bomb=require('./models/bombeiro')
const UserBomb = require('./models/users_bomb')
const { emit } = require('process')
const Group = require('./models/group')
const Call = require('./models/call')
io.on("connection",socket=>{
    console.log('connected as: ',socket.id);
    socket.on('verify', email=>{
        User.findOne({where:{email:{[Op.eq]: email}}}).then(e=>{
            const code=Math.floor(Math.random(0,1)*999999)
            if(!!e){
                User.update({code:code,exp:Math.floor(Date.now()/1000+60*10)},{where:{email:{[Op.eq]:email}}}).then(()=>{randomCode({email:email,code:code,socketid:socket.id})}).catch(i=>console.log(i))

            }else{
                User.create({email:email,code:code,exp:Math.floor(Date.now()/1000+60*60)}).then(()=>{randomCode({email:email,code:code,socketid:socket.id})}).catch(i=>console.log(i))}
            }).catch(e=>console.log(e))
    });
    socket.on("bombs",async([token,pg=1,input])=>{
        if(!pg){
            pg=1;
        }
        const inPage=4;
        console.log("bombs emit: ",token,pg,input)
        const user=dotoken.decode(token)
        User.findOne({where:{email:{[Op.eq]: user.email}}}).then(u=>{
            user['id']=u.id;
            UserBomb.findAll({where:{UserId:{[Op.eq]:user.id}},order: [['BombId','ASC']]}).then(e=>{
                if(e.length>0){
                    let find={where:{id:{[Op.in]:e.map((i)=>{return i.id})}},offset:inPage-(inPage*pg),limit:inPage}
                    if(!!input[0]){
                        find['where']['zipcode']={[Op.like]:'%'+input[0]+'%'}
                        console.log(find)
                    }if(!!input[1]){
                        find['where']['address']={[Op.like]:'%'+input[1]+'%'}
                        console.log(find)
                    }if(!!input[2]){
                        find['where']['neighborhood']={[Op.like]:'%'+input[2]+'%'}
                        console.log(find)
                    }if(!!input[3]){
                        find['where']['country']={[Op.like]:'%'+input[3]+'%'}
                        console.log(find)
                    }
                    Bomb.findAll(find).then(k=>{
                        const list=k.map(i=>[i.zipcode,i.address,i.neighborhood,i.country]);
                        console.log(k,list)
                        socket.emit("bombs",list)
                    })
                    //Promise.all(e.map(async bombs=>{
                    //    const bomb=await Bomb.findByPk(bombs.id)
                     //   console.log([bomb.zipcode,bomb.address,bomb.neighborhood,bomb.country])
                     //   list.push([bomb.zipcode,bomb.address,bomb.neighborhood,bomb.country])
                    //})).then(i=>{console.log(list);socket.emit("bombs",list)})
                }else{
                    socket.emit("bombs",e)
                }
            })
        })

    })
    socket.on("calls",async([token,pg=1,input])=>{
        if(!pg){
            pg=1;
        }
        const inPage=4;
        console.log("call emit: ",token,pg,input)
        const user=dotoken.decode(token)
        User.findOne({where:{email:{[Op.eq]: user.email}}}).then(u=>{
            user['id']=u.id;
            UserBomb.findAll({where:{UserId:{[Op.eq]:user.id}},order: [['BombId','ASC']]}).then(e=>{
                if(e.length>0){
                    Group.findAll({where:{BombId:{[Op.in]:e.map((i)=>{return i.BombId})}}}).then(k=>{
                        let find={where:{GroupId:{[Op.in]:k.map((i)=>{return i.id})}},offset:inPage-(inPage*pg),limit:inPage}
                        if(!!input[0]){
                            find['where']['type']={[Op.like]:'%'+input[0]+'%'}
                            console.log(find)
                        }if(!!input[1]){
                            find['where']['address']={[Op.like]:'%'+input[1]+'%'}
                            console.log(find)
                        }if(!!input[2]){
                            find['where']['neighborhood']={[Op.like]:'%'+input[2]+'%'}
                            console.log(find)
                        }if(!!input[3]){
                            find['where']['country']={[Op.like]:'%'+input[3]+'%'}
                            console.log(find)
                        }
                        Call.findAll(find)
                        const list=k.map(i=>[i.zipcode,i.address,i.neighborhood,i.country]);
                        console.log(k,list)
                        socket.emit("calls",list)
                    })
                    //Promise.all(e.map(async bombs=>{
                    //    const bomb=await Bomb.findByPk(bombs.id)
                    //   console.log([bomb.zipcode,bomb.address,bomb.neighborhood,bomb.country])
                    //   list.push([bomb.zipcode,bomb.address,bomb.neighborhood,bomb.country])
                    //})).then(i=>{console.log(list);socket.emit("bombs",list)})
                }else{
                    socket.emit("calls",e)
                }
            })
        })
    })
    socket.on("groups",token=>{
        const user=dotoken.decode(token)
        User.findOne({where:{email:{[Op.eq]: user.email}}}).then(u=>{
            user['id']=u.id;
            UserBomb.findAll({where:{UserId:{[Op.eq]:user.id}},order: [['BombId','ASC']]}).then(e=>{
                if(e.length>0){
                    console.log(e.map((i)=>{return i.BombId}))
                    Bomb.findAll({where:{id:{[Op.in]:e.map((i)=>{return i.BombId})}}}).then(k=>{
                        console.log(k,k.map(i=>i.zipcode))
                        socket.emit("groups",k.map(i=>i.zipcode))
                    })
                }else{
                    socket.emit("groups",e)
                }
            })
        })
    })
})
module.exports= {api,server,io}