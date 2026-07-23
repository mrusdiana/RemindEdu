'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 
    let profiles = JSON.parse(await fs.readFile('./data/profiles.json', 'utf8'))

    profiles.forEach(profile => {
      
      delete profile.id
      profile.createdAt = new Date()
      profile.updatedAt = new Date()
    });

    await queryInterface.bulkInsert('Profiles', profiles)
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Profiles', null, {})
  }
};
