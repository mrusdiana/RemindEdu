'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Hastag extends Model {

    static associate(models) {
      Hastag.belongsToMany(models.Post, {
        through: models.PostHastag, 
        foreignKey: 'hashtagId'
      });
    }
    
  }
  Hastag.init({
    name: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Hastag',
  });
  return Hastag;
};