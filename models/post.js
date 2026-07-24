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
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Content Is Required!" },
        notNull: { msg: "Content Is Required!" }
      }
    }
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};