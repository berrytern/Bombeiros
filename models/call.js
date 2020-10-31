const { TIME } = require("sequelize");
const { Model, DataTypes, NOW } = require("sequelize");
const {sequelize} = require('.')
const User = require("./user");
console.log(sequelize.models)
const Call = sequelize.define("Calls", {
  latitude: {
    type: DataTypes.FLOAT,
    allowNull:false,
    validate: {
      min: -90,
      max: 90
    }
  },
  longitude: {
    type: DataTypes.FLOAT,
    allowNull:false,
    validate: {
      min: -180,
      max: 180
    }
  },
  type: {
    type:DataTypes.STRING,
    allowNull: false,
    validate:{
      isIn: [['fire','rescue','salvage']]
    }
  },requirements:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },timeToEnd:{
    type:DataTypes.INTEGER,
  },streetName:{
    type:DataTypes.STRING,
    allowNull:false
  },streetNumber:{
    type:DataTypes.STRING,
    allowNull:false
  },city:{
    type:DataTypes.STRING,
    allowNull:false,
  },
  problem:{
    type:DataTypes.STRING,
    allowNull: false,
  },
  priority:{
    type:DataTypes.INTEGER,
    allowNull:false,
    validate:{
      isInt:true,
      
    }
  },
  date:{
    type:DataTypes.INTEGER,
    defaultValue:parseInt(Date.now()/1000),
    allowNull: false,
  },
  status:{
    type: DataTypes.BOOLEAN,
    defaultValue:false
  },
},{
  hooks: {
    beforeCreate: (call, options) => {
      call.problem=call.problem.toUpperCase();
      call.streetName=call.streetName.toUpperCase();
      call.city=call.city.toUpperCase();
    },
  },
  sequelize,
});
User.hasMany(Call)
Call.belongsTo(User)

module.exports= Call