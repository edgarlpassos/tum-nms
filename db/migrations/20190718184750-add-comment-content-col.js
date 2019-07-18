module.exports = {
  up: (queryInterface, Sequelize) => queryInterface.addColumn('Comments', 'content', Sequelize.STRING),
  down: queryInterface => queryInterface.removeColumn('Comments', 'content'),
};
