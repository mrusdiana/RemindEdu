'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.belongsTo(models.Profile, {
        foreignKey: 'userId'
      }),

      User.hasMany(models.Post, {
        foreignKey: 'userId'
      }),
      
      User.hasMany(models.Task, {
        foreignKey: 'userId'
      })
    }
  }
  User.init({
    name: DataTypes.STRING,
    email: DataTypes.STRING,
    password: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'User',
  });
  User.beforeCreate(pass => {
    const salt = bcrypt.genSaltSync(10)
    pass.password = bcrypt.hashSync(pass.password, salt)
  })
  return User;
};