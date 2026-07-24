'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 
    let postHastags = JSON.parse(await fs.readFile('./data/postHastags.json', 'utf8'))

    postHastags.forEach(hastag => {
      
      delete hastag.id
      hastag.createdAt = new Date()
      hastag.updatedAt = new Date()
    });

    await queryInterface.bulkInsert('PostHastags', postHastags)
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('PostHastags', null, {})
  }
};
