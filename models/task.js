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
    let randomAngka = Math.floor(Math.random() * (300 - 100 + 1)) + 100;
    let hasil = el.courseName.slice(0, 4);

    el.courseName = `${randomAngka} ${hasil}`
  })
  return Task;
};