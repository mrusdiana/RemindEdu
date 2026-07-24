'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {

    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey:'userId'
      }),
      Post.belongsToMany(models.Hastag, {
        through: models.PostHastag,
        foreignKey: 'postId'
      });
    }
    
  }
  Post.init({
    userId: DataTypes.INTEGER,
    content: DataTypes.TEXT
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};