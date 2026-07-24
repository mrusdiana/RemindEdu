'use strict';
const fs = require('fs').promises

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
 
    let posts = JSON.parse(await fs.readFile('./data/posts.json', 'utf8'))

    posts.forEach(post => {
      
      delete post.id
      post.createdAt = new Date()
      post.updatedAt = new Date()
    });

    await queryInterface.bulkInsert('Posts', posts)
  },

  async down (queryInterface, Sequelize) {
    
    await queryInterface.bulkDelete('Posts', null, {})
  }
};
