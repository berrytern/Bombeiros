const {api,server,io} = require('./connection')
const consign = require("consign")
const {sequelize}= require('./models')
const rateLimit=require('express-rate-limit')
const UserBomb=require('./models/users_bomb')

sequelize.authenticate().then(isso=>{console.log('connected to database!!!');sequelize.sync();}).catch(error=>console.log(error))
consign()
    .include('./config/parses.js')
    .then('./config/routes.js')
    .into(api)
const apiLimiter = rateLimit({
    windowMs: 5*60*1000, 
    max: 50,
    });
api.use(apiLimiter)
server.listen('4000')