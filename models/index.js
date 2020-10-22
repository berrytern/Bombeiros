const { Sequelize } = require('sequelize');
const sequelize = new Sequelize('postgres://postgres:1234@localhost:5432/banco',{logging:false}) // Example for postgres

module.exports={sequelize}