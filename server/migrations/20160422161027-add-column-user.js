'use strict';
module.exports = {
  up: function(queryInterface, Sequelize) {
    return queryInterface.addColumn(
		  'Users',
		  'is_chat',
		  Sequelize.BOOLEAN
		)
  },
  down: function(queryInterface, Sequelize) {
    return queryInterface.removeColumn('Users', 'is_chat');
  }
};