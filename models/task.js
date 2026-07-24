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

    get formatDate(){
      if (!this.deadline) return '';
      const d = new Date(this.deadline);
      return isNaN(d) ? '' : d.toISOString().split('T')[0];
    }

    static async nowDate() {
      let sekarang = new Date()
      const opsi = { 
        weekday: 'long', 
        year: 'numeric', 
        month: 'long', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit', 
        second: '2-digit' 
      };

      return new Intl.DateTimeFormat('id-ID', opsi).format(sekarang);
    }

  }
  Task.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Task title is required!" },
        notNull: { msg: "Task title is required!" }
      }
    },
    description: DataTypes.TEXT,
    courseName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notEmpty: { msg: "Course name is required!" },
        notNull: { msg: "Course name is required!" }
      }
    },
    isCompleted: DataTypes.BOOLEAN,
    deadline: {
      type: DataTypes.DATE,
      allowNull: false,
      validate: {
        notNull: { msg: "Due date is required!" },
        isDate: { msg: "Due date must be a valid date!" }
      }
    },
    userId: DataTypes.INTEGER
  }, {
    sequelize,
    modelName: 'Task',
  });

  Task.beforeCreate(el => {
    el.isCompleted = false
  })
  return Task;
};