const jwt = require('jwt-simple')
const {SECRET}=require('../.env')
const { Op } = require("sequelize");
const User=require('../models/user')
const gen_token=(json)=>{
    json={...json,exp:Math.floor(Date.now()/1000)+60*20}
    const token = jwt.encode(json,SECRET,'HS256')
    return token
}
function auth(req,res,next){
    return (req,res,next)=>{
        header_token=req.header('Authorization') || null
        if(!header_token){res.status(400).send()
        }else{
            const token = req.header('Authorization').split(' ')[1] || null
            if(!token){
                res.status(404).send()
            }else{
                try{
                    req.user=jwt.decode(token, SECRET)
                    User.findOne({where:{email:{[Op.eq]: req.user.email}}}).then(doc=>{
                        if(!doc){res.status(401).send()
                        }else{
                            req.user.token=gen_token({id:req.user.id,email:req.user.email})
                            req.user.id=doc.getDataValue('id');
                            console.log('passed')
                            next()
                        }
                    })
                }catch(e){
                    res.status(401).send()
                }
            }
        }
    }
}
const decode=(token)=>{try{return jwt.decode(token, SECRET)}catch(e){return null}};
module.exports={gen_token,auth,decode}