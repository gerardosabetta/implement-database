const Sequelize = require("sequelize");
const sequelize = new Sequelize("mysql://root@192.168.64.2:3306/workshop");

const db = {
  Sequelize: Sequelize,
  sequelize: sequelize,
};

module.exports = db;
