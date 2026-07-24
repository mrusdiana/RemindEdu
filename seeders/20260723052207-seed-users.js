'use strict';
const fs = require('fs').promises
const bcrypt = require('bcryptjs'); 

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    let users = JSON.parse(await fs.readFile('./data/users.json', 'utf8'));

    users.forEach(user => {
      delete user.id;
      user.password = bcrypt.hashSync(user.password, bcrypt.genSaltSync(10)); 
      user.createdAt = new Date();
      user.updatedAt = new Date();
    });

    await queryInterface.bulkInsert('Users', users);
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Users', null, {})
  }
};
