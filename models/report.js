const { Model, DataTypes } = require("sequelize");
const {sequelize} = require('.');
const Call = require("./call");
console.log(sequelize.models)
const Report = sequelize.define("Reports", {
  origem: {
      type:DataTypes.STRING,
      allowNull: false
  },dest:{
    type:DataTypes.STRING,
    allowNull:false,
  },wayPoint:{
    type:DataTypes.STRING,
    allowNull: false
  },time:{
      type:DataTypes.ARRAY(DataTypes.INTEGER),
  },
  CallId: {
    type: DataTypes.INTEGER,
    allowNull:false,
    references: {
      model: Call, // 'Call' would also work
      key: 'id'
    }
  }

});
Call.hasOne(Report, {
  onDelete: 'CASCADE',
  onUpdate: 'CASCADE',
})
Report.belongsTo(Call);
module.exports= Report