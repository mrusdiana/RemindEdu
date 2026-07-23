'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostHastag extends Model {

    static associate(models) {
      PostHastag.hasMany(models.Post, {
        foreignKey:'postId'
      }),
      PostHastag.hasMany(models.Hastag, {
        foreignKey:'hastagId'
      })
    }
    
  }
  PostHastag.init({
    postId: DataTypes.INTEGER,
    hashtagId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'PostHastag',
  });
  return PostHastag;
};