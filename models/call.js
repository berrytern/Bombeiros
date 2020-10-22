const { TIME } = require("sequelize");
const { Model, DataTypes, NOW } = require("sequelize");
const {sequelize} = require('.')
const Group= require('./group');
console.log(sequelize.models)
const Call = sequelize.define("Calls", {
  type: {
    type:DataTypes.STRING,
    allowNull: false,
    validate:{
      isIn: ['fire','rescue','salvage']
    }
  },requirements:{
    type:DataTypes.INTEGER,
    allowNull:false,
  },timeToEnd:{
    type:DataTypes.INTEGER,
  },address:{
    type: DataTypes.STRING,
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
  GroupId: {
    type: DataTypes.INTEGER,
    allowNull:false,
    references: {
      model: Group, // 'Group' would also work
      key: 'id'
    }
  }
});
Group.hasMany(Call, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE'
});
Call.belongsTo(Group);
module.exports= Call