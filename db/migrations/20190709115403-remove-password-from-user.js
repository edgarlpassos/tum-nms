module.exports = {
  up: queryInterface => queryInterface.removeColumn('Users', 'password'),
  down: (queryInterface, Sequelize) => queryInterface.addColumn('Users', 'password', Sequelize.STRING),
};
