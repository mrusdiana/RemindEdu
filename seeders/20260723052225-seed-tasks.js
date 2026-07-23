'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 
    let tasks = JSON.parse(await fs.readFile('./data/tasks.json', 'utf8'))

    tasks.forEach(task => {
      
      delete task.id
      task.createdAt = new Date()
      task.updatedAt = new Date()
    });

    await queryInterface.bulkInsert('Tasks', tasks)
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Tasks', null, {})
  }
};
