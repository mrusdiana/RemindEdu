'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class PostHastag extends Model {

    static associate(models) {
      PostHastag.belongsTo(models.Post, { foreignKey: 'postId' });
      PostHastag.belongsTo(models.Hastag, { foreignKey: 'hastagId' });
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