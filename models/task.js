'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Task extends Model {
    static associate(models) {
      Task.belongsTo(models.User, {
        foreignKey: 'userId'
      })
    }


    formatDeadLine(dateInput) {
      const date = new Date(dateInput);
      const options = { month: 'short', day: 'numeric' };
      const formattedDate = date.toLocaleDateString('en-US', options);
      return `Due ${formattedDate}`;
    }

    get formatDate() {
      return this.deadline ? this.deadline.toISOString().split('T')[0] : ''
    }

  }
  Task.init({
    title:
    {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Title is Required!"
        },
        notNull: {
          msg: "Title is Required!"
        }
      }
    },

    description:
    {
      type: DataTypes.TEXT,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Description is Required!"
        },
        notNull: {
          msg: "Description is Required!"
        }
      }
    },
    courseName: 
    {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Course Name is Required!"
        },
        notNull: {
          msg: "Course Name is Required!"
        }
      }
    },
    isCompleted: 
    {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Is Completed is Required!"
        },
        notNull: {
          msg: "Is Completed is Required!"
        }
      }
    },
    deadline: 
    {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notEmpty: {
          msg: "Deadline is Required!"
        },
        notNull: {
          msg: "Deadline is Required!"
        }
      }
    },
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
  }, {
    sequelize,
    modelName: 'Task',
  });

  Task.beforeCreate(el => {
    el.isCompleted = false
  })
  return Task;
};