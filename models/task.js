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

    static async formatDeadLine(dateInput) {
      const deadline = new Date(dateInput);
      const today = new Date();

      today.setHours(0, 0, 0, 0);
      deadline.setHours(0, 0, 0, 0);

      const diffTime = deadline - today;
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

      const options = { month: 'short', day: 'numeric' };
      const formattedDate = deadline.toLocaleDateString('en-US', options);

      return `Due ${formattedDate} (${diffDays} days left)`;
    }

    get formatDate(){
      return this.deadline.toISOString().split('T')[0]
    }

    static async updateProgressBar(tasks) {
      const totalTasks = tasks.length;
      const completedTasks = tasks.filter(t => t.isCompleted).length;
      const percentage = totalTasks === 0 ? 0 : Math.round((completedTasks / totalTasks) * 100);
  
      const label = document.querySelector('.progress-section .progress-label:nth-child(2)');
      const progressBar = document.querySelector('.progress-section .progress-bar');
  
      if (label) {
          label.textContent = `${completedTasks} / ${totalTasks} completed`;
      }
  
      if (progressBar) {
          progressBar.style.width = `${percentage}%`;
          progressBar.setAttribute('aria-valuenow', percentage);
      }
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