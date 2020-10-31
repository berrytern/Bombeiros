const { Model, DataTypes } = require("sequelize");
const {sequelize} = require('.');
const Call = require("./call");
const User = require("./user");
const Bomb = require("./bombeiro");
console.log(sequelize.models)
const Report = sequelize.define("Reports", {
  
  id:{
    type:DataTypes.INTEGER,
    primaryKey:true,
    autoIncrement:true,
    unique:true
  },img: {
    type: DataTypes.TEXT('long'),
    allowNull: false
  },
  origem: {
      type:DataTypes.STRING,
      allowNull: false
  },dest:{
    type:DataTypes.STRING,
    allowNull:false,
  },wayPoint:{
    type:DataTypes.STRING,
    allowNull: true
  },time:{
      type:DataTypes.ARRAY(DataTypes.INTEGER),
  },start:{
    type:DataTypes.INTEGER,
    allowNull: false,
    defaultValue:Math.floor(Date.now()/1000)
  },end:{
    type:DataTypes.INTEGER,
    allowNull: false,
  },
  inuse:{
    type:DataTypes.INTEGER,
    allowNull: false,
  },
  able:{
    type:DataTypes.INTEGER,
    allowNull: false,
  },
  CallId: {
    type: DataTypes.INTEGER,
    allowNull:false,
    references: {
      model: Call, // 'Call' would also work
      key: 'id'
    }
  },
  BombId: {
    type: DataTypes.INTEGER,
    allowNull:false,
    references: {
      model: Bomb, // 'Bomb' would also work
      key: 'id'
    }
  },
  UserId: {
    type: DataTypes.INTEGER,
    allowNull:false,
  }

});
Call.belongsToMany(Bomb, { through: 'Reports' });
Bomb.belongsToMany(Call, { through: 'Reports' });
module.exports= Report