const { Model, DataTypes } = require("sequelize");
const {sequelize} = require('.')
const Bombs= require('./bombeiro');
const Group = sequelize.define("Groups", {
    fire:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    currentFire:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            custumValidator(value){
                if (parseInt(value) > parseInt(this.fire)) {
                  throw new Error('currentFire must be smaller than otherField.');
                }
            }
        }
    },
    rescue:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    currentRescue:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            isSmallerThanOtherField(value) {
                if (parseInt(value) > parseInt(this.rescue)) {
                  throw new Error('currentRescue must be smaller than otherField.');
                }
              }
        }
    },
    salvage:{
        type:DataTypes.INTEGER,
        allowNull:false,
    },
    currentSalvage:{
        type:DataTypes.INTEGER,
        allowNull:false,
        validate:{
            isSmallerThanOtherField(value) {
                if (parseInt(value) > parseInt(this.salvage)) {
                  throw new Error('currentSalvage must be smaller than otherField.');
                }
              }
        }
    },
    BombId: {
      type: DataTypes.INTEGER,
      allowNull:false,
      unique:true,
      references: {
        model: Bombs, // 'Bomb' would also work
        key: 'id'
      }
    }
},{sequelize});
Bombs.hasOne(Group, {
    onDelete: 'CASCADE',
    onUpdate: 'CASCADE'
})
Group.belongsTo(Bombs)
//module.exports= Group;