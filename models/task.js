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
      return this.deadline ? this.deadline.toISOString().split('T')[0] : ''
    }

  }
  Task.init({
    title: DataTypes.STRING,
    description: DataTypes.TEXT,
    courseName: DataTypes.STRING,
    isCompleted: DataTypes.BOOLEAN,
    deadline: DataTypes.DATE,
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