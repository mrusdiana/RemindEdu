'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    
    await queryInterface.addColumn('Tasks', 'userId', {
      type: Sequelize.DataTypes.INTEGER,
      references: {
        model: 'Users',
        key: 'id'
      }
    })
  },

  async down (queryInterface, Sequelize) {
   
    await queryInterface.removeColumn('Tasks', 'userId')
  }
};
