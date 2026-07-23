'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 
    let hastags = JSON.parse(await fs.readFile('./data/hastags.json', 'utf8'))

    hastags.forEach(hastag => {
      
      delete hastag.id
      hastag.createdAt = new Date()
      hastag.updatedAt = new Date()
    });

    await queryInterface.bulkInsert('Hastags', hastags)
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Hastags', null, {})
  }
};
