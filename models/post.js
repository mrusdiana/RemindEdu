'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Post extends Model {

    static associate(models) {
      Post.belongsTo(models.User, {
        foreignKey: 'userId'
      }),
        Post.belongsToMany(models.Hastag, {
          through: models.PostHastag,
          foreignKey: 'postId'
        });
    }

  }
  Post.init({
    userId: DataTypes.STRING,
    content: DataTypes.TEXT,
    like: DataTypes.INTEGER,
    comment: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};