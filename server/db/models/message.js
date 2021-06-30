const Sequelize = require("sequelize");
const db = require("../db");

const Message = db.define("message", {
  text: {
    type: Sequelize.STRING,
    allowNull: false,
  },
  senderId: {
    type: Sequelize.INTEGER,
    allowNull: false,
  },
  isRead: {
    type: Sequelize.BOOLEAN,
    allowNull: false,
  },
  isMostRecentRead: {
    type: Sequelize.BOOLEAN,
    alloWNull: false,
  }
});

module.exports = Message;
