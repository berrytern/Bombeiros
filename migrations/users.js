module.exports = {
    up: (queryInterface, Sequelize) => {
      return queryInterface.createTable('users', {
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
    },
    down: (queryInterface, Sequelize) => {
      return queryInterface.dropTable('users');
    }
  };