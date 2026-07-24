'use strict';
const bcrypt = require('bcrypt');

const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {

    static associate(models) {
      User.hasOne(models.Profile, {
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
    name:
    {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Name is Required!"
        },
        notNull: {
          msg: "Name is Required!"
        }
      }
    },
    email:  {
      type: DataTypes.STRING,
      allowNull: false,
      unique: {
        msg: "Email is already registered!"
      },
      validate: {
        notEmpty: {
          msg: "Email is Required!"
        },
        notNull: {
          msg: "Email is Required!"
        },
        isEmail: {
          msg: "Email format is invalid!"
        }
      }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Password is Required!"
        },
        notNull: {
          msg: "Password is Required!"
        },
        len: {
          args: [6, 72],
          msg: "Password must be 6-72 characters!"
        }
      }
    },
    role: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Role is Required!"
        },
        notNull: {
          msg: "Role is Required!"
        }
      }
    },
  }, {
    sequelize,
    modelName: 'User',
  });

  User.prototype.comparePassword = async function (candidatePassword) {
    return await bcrypt.compare(candidatePassword, this.password);
  };

  User.beforeSave(async (user) => {
    if (user.changed('password')) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(user.password, salt);
    }
  });

  return User;
};