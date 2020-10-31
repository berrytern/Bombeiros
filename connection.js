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
const Call = require('./models/call')
const Report = require('./models/report')
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
        try{
            const user=dotoken.decode(token)
            User.findOne({where:{email:{[Op.eq]: user.email}},include: Bomb}).then(u=>{
                if(!!u){
                    const e=u.Bombs
                    if(e.length>0){
                        let next=false;
                        list=e.filter(i=>{
                            let bool=true;
                            if(!!input[0]&&bool){
                                bool=i.zipcode.includes(input[0].toUpperCase());
                            }if(!!input[1]&&bool){
                                bool=i.name.includes(input[1].toUpperCase());
                            }if(!!input[2]&&bool){
                                bool=i.streetName.includes(input[2].toUpperCase());
                            }if(!!input[3]&&bool){
                                bool=i.streetNumber.includes(input[3].toUpperCase());
                            }if(!!input[4]&&bool){
                                bool=i.neighborhood.includes(input[4].toUpperCase());
                            }
                            return bool
                        }).filter((i,index)=>{
                            if(index>=pg*inPage&&next==false){
                                next=true
                            }
                            return index<pg*inPage&&index>=(pg-1)*inPage}).map(i=>[i.zipcode,i.name,i.streetName,i.streetNumber,i.neighborhood])
                        const token=dotoken.gen_token({email:user.email})
                        socket.emit("bombs",list,next,token)
                    }else{
                        socket.emit("bombs",e)
                    }
                }else{
                    socket.emit('names',false)
                }
            })
        }catch(e){
            socket.emit("bombs",false)
        }
    })
    socket.on("calls",async([token,pg=1,input])=>{
        if(!pg){
            pg=1;
        }
        const inPage=4;
        try{
            const user=dotoken.decode(token)
            User.findOne({where:{email:{[Op.eq]: user.email}},include:Call}).then(u=>{
                if(!!u){
                    let next=false;
                    list=u.Calls.filter(i=>{
                        let bool=true;
                        if(!!input[0]&&bool){
                            bool=i.type.includes(input[0]);
                        }if(!!input[1]&&bool){
                            bool=i.problem.includes(input[1].toUpperCase());
                        }if(!!input[2]&&bool){
                            bool=i.streetName.includes(input[2].toUpperCase());
                        }if(!!input[3]&&bool){
                            bool=i.streetNumber.includes(input[3].toUpperCase());
                        }if(!!input[4]&&bool){
                            bool=i.priority.includes(input[4].toUpperCase());
                        }
                        return bool
                    }).filter((i,index)=>{
                        if(index>=pg*inPage&&next==false){
                            next=true
                        }
                        return index<pg*inPage&&index>=(pg-1)*inPage}).map(i=>[i.type,i.problem,i.streetName,i.streetNumber,i.priority])
                        
                        const token=dotoken.gen_token({email:user.email})
                        socket.emit("calls",list,next,token)
                }else{
                    socket.emit('names',false)
                }
            })
        }catch(e){
            socket.emit("calls",false)
        }
    })
    socket.on("names",token=>{
        console.log("names emit: ",token)
        try{
            const user=dotoken.decode(token)
            User.findOne({where:{email:{[Op.eq]: user.email}},include: Bomb}).then(u=>{
                if(!!u){
                    const e=u.Bombs
                    if(e.length>0){
                        let list=e.map((i)=>i.name)
                        const token=dotoken.gen_token({email:user.email})
                        socket.emit('names',list,token)
                    }
                }else{
                    socket.emit('names',false)
                }
            }).catch(e=>e)
        }catch(e){socket.emit('names',false)}
    })
    socket.on("reports",async([token,pg=1,input])=>{
        console.log('emit reports:',input)
        if(!pg){
            pg=1;
        }
        const inPage=4;
        try{
            const user=dotoken.decode(token)
            User.findOne({where:{email:{[Op.eq]: user.email}}}).then(async u=>{
                if(!!u){
                    let opts={where:{UserId:{[Op.eq]:u.id}}}
                    if(!!input[0]){
                        const bomb = await Bomb.findOne({where:{name:{[Op.eq]:input[0].toUpperCase()}}})
                        opts['where']['BombId']={[Op.eq]:bomb.id}
                    }else if(!!input[1]){
                        opts['where']['dest']={[Op.like]:'%'+input[1].toUpperCase()+'%'}
                    }
                    let rp = await Report.findAll(opts)
                    let list=[]
                    let x;
                    for(x=0;x<rp.length;x++){
                        const i=rp[x];
                        const b=await Bomb.findOne({where:{id:{[Op.eq]:i.BombId}}})
                        list.push({fields:[b.name,i.dest],ondrop:{origem:i.origem,destino:i.dest,inuse:i.inuse,able:i.able,tempo_ida:i.time[0]/60,tempo_volta:i.time[2]/60,tempo_action:i.time[1]/60,img:i.img},drop:false})
                    }
                    let next
                    list.filter((i,index)=>{
                        if(index>=pg*inPage&&next==false){
                            next=true
                        }
                        return index<pg*inPage&&index>=(pg-1)*inPage})
                    const token=dotoken.gen_token({email:user.email})
                    socket.emit("reports",list,next,token)
                }else{
                    socket.emit("reports",false)
                }
                /*let next=false;
                list=u.Calls.filter(i=>{
                    let bool=true;
                    if(!!input[0]&&bool){
                        bool=i.type.includes(input[0]);
                    }if(!!input[1]&&bool){
                        bool=i.problem.includes(input[1].toUpperCase());
                    }if(!!input[2]&&bool){
                        bool=i.streetName.includes(input[2].toUpperCase());
                    }if(!!input[3]&&bool){
                        bool=i.streetNumber.includes(input[3].toUpperCase());
                    }if(!!input[4]&&bool){
                        bool=i.priority.includes(input[4].toUpperCase());
                    }
                    return bool
                }).filter((i,index)=>{
                    if(index>=pg*inPage&&next==false){
                        next=true
                    }
                    return index<pg*inPage&&index>=(pg-1)*inPage}).map(i=>[i.type,i.problem,i.streetName,i.streetNumber,i.priority])
                    
                    const token=dotoken.gen_token({email:user.email})
                    socket.emit("reports",list,next,token)*/
            })
        }catch(e){
            //socket.emit("reports",false)
        }
    })
})
module.exports= {api,server,io}