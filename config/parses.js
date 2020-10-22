const express = require("express")
const cors = require('cors')
const bodyparser = require('body-parser')

const whitelist = ['https://berrytern.github.io', 'file:','https://hangouts.google.com','https://easyfire-forceroute.herokuapp.com']
const corsOptionsDelegate = function (req, callback) {
  var corsOptions;
  if (whitelist.indexOf(req.header('Origin')) !== -1) {
    corsOptions = { origin: true } // reflect (enable) the requested origin in the CORS response
  } else {
    console.log(req.header('Origin'))
    corsOptions = { origin: true } // disable CORS for this request
  }
  callback(null, corsOptions) // callback expects two parameters: error and options
}
 
//Configurações
    // cors
    
module.exports =api=>{
    api.use(cors(corsOptionsDelegate))
    api.use(bodyparser.urlencoded({ extended: false }));
    api.use(bodyparser.json())
}