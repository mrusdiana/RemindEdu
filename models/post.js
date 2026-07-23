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
    userId: 
    {
      type: DataTypes.INTEGER,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "UserId is Required!"
        },
        notNull: {
          msg: "UserId is Required!"
        }
      }
    },
    content: 
    {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Content is Required!"
        },
        notNull: {
          msg: "Content is Required!"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'Post',
  });
  return Post;
};