const { Model, DataTypes } = require("sequelize");
const {sequelize} = require('.')
console.log(sequelize.models)
const User = sequelize.define("Users", {
  email: {
      type:DataTypes.TEXT,
        unique:true,
        allowNull: false,
        validate:{
          isEmail:true
        }
  },code:{
    type:DataTypes.INTEGER,
    unique:true,
    allowNull:false,
  },exp:{
    type:DataTypes.INTEGER,
  }
});

module.exports= User